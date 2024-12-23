import { glob } from "glob";
import path from "path";
import { DiscordClient } from "../client";
import { AbstractModule } from "@/abstractions/module.abstract";
import { MetadataKeys } from "../types/metadata-keys.enum";
import { IEventOptions } from "../decorators";

export interface IDecoratorMetadataKeys {
  key: string;
  method: unknown;
}

export class DiscordCollector {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  /**
   * Collect and process all modules from the file system.
   */
  async collect(): Promise<void> {
    const files = await glob("**/*.{ts,js}", {
      ignore: ["**/node_modules/**"],
    });

    for (const filePath of files) {
      try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        const module = await import(absolutePath);

        for (const value of Object.values(module)) {
          if (this.isValidModule(value)) {
            await this.processModule(value);
          }
        }
      } catch {
        continue;
      }
    }
  }

  /**
   * Check if a value is a valid module extending AbstractModule.
   */
  private isValidModule(value: any): value is typeof AbstractModule {
    const inheritClass =
      this.client.options.loader?.auto?.parentClass || AbstractModule;

    return (
      typeof value === "function" && value.prototype instanceof inheritClass
    );
  }

  /**
   * Process a valid module: add events, commands, and auto-complete handlers to the client.
   */
  private async processModule(
    ModuleClass: typeof AbstractModule
  ): Promise<void> {
    const moduleInstance = new ModuleClass({
      ...ModuleClass.prototype.options,
    });
    const methods = this.getModuleMethods(moduleInstance);
    await Promise.all([
      this.addModule(moduleInstance),
      this.addEvents(moduleInstance, MetadataKeys.EVENT, methods),
      this.addCommands(moduleInstance, MetadataKeys.EVENT, methods),
      this.addAutoComplete(moduleInstance, MetadataKeys.EVENT, methods),
    ]);
  }

  private getModuleName(module: AbstractModule) {
    return String(module.options.name || module.constructor.name.toLowerCase());
  }

  private addModule(module: AbstractModule) {
    this.client.options.modules!.set(this.getModuleName(module), {
      isEnabled: true,
      module: module,
    });
  }

  private getMetadata<T>(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): { metadata: T; method: unknown }[] {
    const prototype = Object.getPrototypeOf(module);
    return methods
      .map((method) => {
        const { key, method: metadataMethod } = method;
        const metadata = Reflect.getMetadata(metadataKey, prototype, key);
        return metadata ? { metadata, method: metadataMethod } : null;
      })
      .filter((value) => value !== null);
  }

  /**
   * Add events from the module to the client's cache.
   */
  private addEvents(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): void {
    const metadata = this.getMetadata<IEventOptions>(
      module,
      metadataKey,
      methods
    );
    metadata.map((event) => {
      // @ts-ignore
      const boundMethod = event.method!.bind(module);
      this.client.options.events!.set(
        `${this.getModuleName(module)}_${event.metadata.name}`,
        // @ts-ignore
        { options: event.metadata, executor: boundMethod }
      );
    });
  }

  /**
   * Add commands from the module to the client's cache.
   */
  private addCommands(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): void {
    // Implement command handling logic here
  }

  /**
   * Add auto-complete handlers from the module to the client's cache.
   */
  private addAutoComplete(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): void {
    // Implement auto-complete handling logic here
  }

  /**
   * Getting methods for check their metadata
   */
  private getModuleMethods(module: AbstractModule): IDecoratorMetadataKeys[] {
    const prototype = Object.getPrototypeOf(module);
    return Object.getOwnPropertyNames(prototype)
      .filter((key) => {
        const property = prototype[key];
        return typeof property === "function" && key !== "constructor";
      })
      .map((key) => ({ key, method: prototype[key] }));
  }
}
