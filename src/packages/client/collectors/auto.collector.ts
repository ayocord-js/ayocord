import { glob } from "glob";
import path from "path";
import { DiscordClient } from "../client";
import {
  ModuleMetadataKeys,
  ViewMetadataKeys,
} from "../../../shared/types/metadata-keys.enum";
import { IModuleOptions } from "@/packages/modules/decorators";
import { BaseCollector } from "./base.collector";
import { InteractionHandler } from "@/packages";

/**
 * Represents metadata associated with a class or method decorated with specific keys.
 */
export interface IDecoratorMetadataKeys {
  key: string; // The name of the method
  method: unknown; // The actual method reference
}

/**
 * Base class responsible for collecting and processing Discord module methods.
 */
export class AutoDiscordCollector extends BaseCollector {
  public client: DiscordClient;

  constructor(client: DiscordClient) {
    super();
    this.client = client;
  }

  /**
   * Collects and processes all module files and their decorated methods.
   */
  public async collect(): Promise<void> {
    const modules = await this.getAllProjectModules();
    await Promise.allSettled(
      modules.map((module) => {
        module.map((value: any) => {
          const isValid = this.isValidClass(value, ModuleMetadataKeys.MODULE)
          if (isValid) {
            this.processModule(value);
          }
        });
      })
    );
  }

  /**
   * Processes a module by initializing its metadata and handlers.
   * @param module The module class to process.
   */
  protected async processModule(module: any): Promise<void> {
    const moduleMetadata = this.getMetadata(
      module,
      ModuleMetadataKeys.MODULE
    ) as IModuleOptions;

    const methods = BaseCollector.getModuleMethods(module);
    const moduleInstance = new module();

    this.client.modules.set(moduleMetadata.name, {
      module: moduleMetadata,
      instance: moduleInstance,
      isEnabled: true,
    });

    await Promise.allSettled(
      methods.map(async (method) => {
        for (const key of Object.values(ModuleMetadataKeys)) {
          await this.addHandler(moduleInstance, method, key, moduleMetadata);
        }
      })
    );
  }

  /**
   * Adds a handler for a specific metadata type.
   * @param moduleInstance The instance of the module.
   * @param method The method to process.
   * @param metadataKey The type of metadata to handle.
   * @param moduleMetadata The metadata of the module.
   */
  private async addHandler(
    moduleInstance: any,
    method: IDecoratorMetadataKeys,
    metadataKey: ModuleMetadataKeys | ViewMetadataKeys,
    moduleMetadata: IModuleOptions
  ): Promise<void> {
    const metadata = Reflect.getMetadata(metadataKey, moduleInstance, method.key)

    if (!metadata) {
      return
    };

    const boundMethod = (method.method as Function).bind(moduleInstance);

    const handlerId = this.generateHandlerId(
      metadataKey,
      metadata,
      moduleMetadata
    );

    const handlerMap = this.getHandlerMap(metadataKey);

    handlerMap?.set(handlerId, {
      executor: boundMethod,
      options: metadata,
      module: moduleMetadata,
    });
  }

  /**
   * Generates a unique handler ID based on metadata.
   * @param metadataKey The type of metadata.
   * @param metadata The metadata object.
   * @param moduleMetadata The module's metadata.
   * @returns A unique handler ID string.
   */
  private generateHandlerId(
    metadataKey: ModuleMetadataKeys | ViewMetadataKeys,
    metadata: any,
    moduleMetadata: IModuleOptions
  ): string {
    switch (metadataKey) {
      case ModuleMetadataKeys.EVENT:
        return `${moduleMetadata.name}_${metadata.name}`;
      case ModuleMetadataKeys.COMPONENT:
        return metadata.customId;
      case ModuleMetadataKeys.SLASH_COMMAND:
        return metadata.builder.name.toLowerCase();
      case ModuleMetadataKeys.TEXT_COMMAND:
        return metadata.name.toLowerCase();
      case ModuleMetadataKeys.SUB_COMMAND:
        return InteractionHandler.getCommandName(metadata.parentName, metadata.groupName, metadata.name);
      case ModuleMetadataKeys.AUTO_COMPLETE:
        return InteractionHandler.getCommandName(metadata.parentName, metadata.groupName, metadata.name);
      default:
        return moduleMetadata.name;
    }
  }

  /**
   * Retrieves the appropriate handler map based on metadata key.
   * @param metadataKey The type of metadata.
   * @returns The corresponding handler map or null if not found.
   */
  private getHandlerMap(
    metadataKey: ModuleMetadataKeys | ViewMetadataKeys
  ): Map<string, any> | null {
    switch (metadataKey) {
      case ModuleMetadataKeys.EVENT:
        return this.client.events;
      case ModuleMetadataKeys.COMPONENT:
        return this.client.components;
      case ModuleMetadataKeys.SLASH_COMMAND:
        return this.client.slashCommands;
      case ModuleMetadataKeys.TEXT_COMMAND:
        return this.client.textCommands;
      case ModuleMetadataKeys.AUTO_COMPLETE:
        return this.client.autoComplete;
      case ModuleMetadataKeys.SUB_COMMAND:
        return this.client.subCommands;
      default:
        return null;
    }
  }
}
