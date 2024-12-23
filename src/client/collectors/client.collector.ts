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

/**
 * Core class for collecting everything in your project
 */

export class DiscordCollector {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

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

  protected isValidModule(value: any): value is typeof AbstractModule {
    const inheritClass =
      this.client.loader?.auto?.parentClass || AbstractModule;

    return (
      typeof value === "function" && value.prototype instanceof inheritClass
    );
  }

  protected async processModule(
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

  protected getModuleName(module: AbstractModule) {
    return String(module.options.name || module.constructor.name.toLowerCase());
  }

  protected addModule(module: AbstractModule) {
    this.client.modules.set(this.getModuleName(module), {
      isEnabled: true,
      module: module,
    });
  }

  protected getMetadata<T>(
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

  protected addEvents(
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
      this.client.events.set(
        `${this.getModuleName(module)}_${event.metadata.name}`,
        { options: event.metadata, executor: boundMethod, module }
      );
    });
  }

  protected addCommands(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): void {
    // Implement command handling logic here
  }

  protected addAutoComplete(
    module: AbstractModule,
    metadataKey: MetadataKeys,
    methods: IDecoratorMetadataKeys[]
  ): void {
    // Implement auto-complete handling logic here
  }

  protected getModuleMethods(module: AbstractModule): IDecoratorMetadataKeys[] {
    const prototype = Object.getPrototypeOf(module);
    return Object.getOwnPropertyNames(prototype)
      .filter((key) => {
        const property = prototype[key];
        return typeof property === "function" && key !== "constructor";
      })
      .map((key) => ({ key, method: prototype[key] }));
  }
}
