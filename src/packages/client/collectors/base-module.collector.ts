import { glob } from "glob";
import path from "path";
import { DiscordClient } from "../client";
import { MetadataKeys } from "../../../shared/types/metadata-keys.enum";
import {
  IAutoCompleteOptions,
  IComponentOptions,
  IEventOptions,
  ISlashCommandOptions,
  ITextCommandOptions,
} from "../../interactions/decorators";
import { IModuleOptions } from "@/packages/modules/decorators";
import { CommandType } from "../types";
import { ISubCommandOptions } from "@/packages/interactions/decorators/sub-command.decorator";

/**
 * Interface to represent the decorator metadata for methods
 */
export interface IDecoratorMetadataKeys {
  key: string; // The key name of the method
  method: unknown; // The actual method
}

/**
 * DiscordCollector is responsible for collecting all modules
 * and processing their methods decorated with @Event and @Component
 */
export class BaseDiscordCollector {
  protected client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  /**
   * Collects all module files and processes their decorated methods
   */
  public async collect(): Promise<void> {
    const extension = require.main?.filename.endsWith(".js") ? "js" : "ts"; // Determine file extension (js or ts)

    // Retrieve all files with the determined extension, ignoring node_modules
    const files = await glob(`**/*.${extension}`, {
      ignore: ["**/node_modules/**", "node_modules/**"],
      cwd: process.cwd(),
    });

    // Process each module file
    for (const file of files) {
      const absolutePath = path.resolve(process.cwd(), file);
      try {
        const module = await import(absolutePath);
        const promises = Object.values(module).map(async (value) => {
          if (this.isValidModule(value as any)) {
            await this.processModule(value);
          }
        });
        await Promise.allSettled(promises);
      } catch (error) {
        continue;
      }
    }
  }

  /**
   * Gets metadata for the provided value and key
   * @param value The target object (class or method)
   * @param key The metadata key to retrieve
   * @returns Metadata associated with the key, or null if not found
   */
  protected getMetadata<T>(value: any, key: MetadataKeys): T | null {
    return Reflect.getMetadata(key, value);
  }

  /**
   * Checks whether the provided value has module metadata
   * @param value The object to check
   * @returns Boolean indicating if the value is a valid module
   */
  protected isValidModule(value: Object): boolean {
    return !!this.getMetadata(value, MetadataKeys.MODULE);
  }

  /**
   * Processes the module by handling its decorated methods
   * @param module The module class to process
   */
  protected async processModule(module: any): Promise<void> {
    const moduleMetadata = this.getMetadata(
      module,
      MetadataKeys.MODULE
    ) as IModuleOptions;
    const methods = this.getModuleMethods(module);

    // Process methods with associated event/component metadata

    const promises = methods.map((method) =>
      Promise.allSettled([
        this.client.modules.set(moduleMetadata.name, {
          module: moduleMetadata,
          instance: new module(),
          isEnabled: true,
        }),
        Object.values(MetadataKeys).map((value) => {
          this.addHandler(module, method, value, moduleMetadata);
        }),
      ])
    );

    await Promise.allSettled(promises); // Await all promises
  }

  /**
   * Adds event or component handler to the respective client map
   * @param module The module class to process
   * @param method The method to process
   * @param metadataKey The metadata key (either EVENT or COMPONENT)
   * @param moduleMetadata The module's metadata
   */
  protected async addHandler(
    module: any,
    method: IDecoratorMetadataKeys,
    metadataKey: MetadataKeys,
    moduleMetadata: IModuleOptions
  ): Promise<void> {
    const metadata = Reflect.getMetadata(
      metadataKey,
      module.prototype,
      method.key
    );
    if (!metadata) return;

    const boundMethod = (method.method as any).bind(module);
    if (metadataKey === MetadataKeys.MODULE) {
      const handlerId = `${moduleMetadata.name}`;
      this.client.modules.set(handlerId, {
        module: moduleMetadata,
        instance: new module(),
        isEnabled: true,
      });
    }
    if (metadataKey === MetadataKeys.EVENT) {
      const handlerId = `${moduleMetadata.name}_${metadata.name}`;
      this.client.events.set(handlerId, {
        executor: boundMethod,
        options: metadata as IEventOptions,
        module: moduleMetadata,
      });
    } else if (metadataKey === MetadataKeys.COMPONENT) {
      const handlerId = `${metadata.customId}`;
      this.client.components.set(handlerId, {
        executor: boundMethod,
        options: metadata as IComponentOptions,
        module: moduleMetadata,
      });
    } else if (metadataKey === MetadataKeys.SLASH_COMMAND) {
      const handlerId = `${metadata.builder!.name.toLowerCase()}`;
      this.client.slashCommands.set(handlerId, {
        executor: boundMethod,
        options: metadata as ISlashCommandOptions,
        module: moduleMetadata,
      });
    } else if (metadataKey === MetadataKeys.TEXT_COMMAND) {
      const handlerId = `${metadata.name.toLowerCase()}`;
      this.client.textCommands.set(handlerId, {
        executor: boundMethod,
        options: metadata as ITextCommandOptions,
        module: moduleMetadata,
      });
    } else if (metadataKey === MetadataKeys.AUTO_COMPLETE) {
      const handlerId = `${metadata.parentName}_${
        metadata.groupName ? "_" + metadata.groupName : ""
      }${metadata.subCommandName ? "_" + metadata.subCommandName : ""}`;
      this.client.autoComplete.set(handlerId, {
        executor: boundMethod,
        options: metadata as IAutoCompleteOptions,
        module: moduleMetadata,
      });
    } else if (metadataKey === MetadataKeys.SUB_COMMAND) {
      const handlerId = `${metadata.parentName}${
        metadata.groupName ? "_" + metadata.groupName : ""
      }_${metadata.name}`;
      this.client.subCommands.set(handlerId, {
        executor: boundMethod,
        options: metadata as ISubCommandOptions,
        module: moduleMetadata,
      });
    }
  }

  /**
   * Retrieves methods of the module class that are decorated with metadata
   * @param module The module class to retrieve methods from
   * @returns Array of methods and their associated metadata
   */
  protected getModuleMethods(module: any): IDecoratorMetadataKeys[] {
    const prototype = module.prototype;

    // Filter out the constructor and retrieve function methods
    return Object.getOwnPropertyNames(prototype)
      .filter((key) => key !== "constructor")
      .map((key) => ({ key, method: prototype[key] }));
  }
}