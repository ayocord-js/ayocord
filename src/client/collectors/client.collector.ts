import { glob } from "glob";
import path from "path";
import { DiscordClient } from "../client";
import { AbstractModule } from "@/abstractions/module.abstract";

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
    await Promise.all([
      this.addModule(moduleInstance),
      this.addEvents(moduleInstance),
      this.addCommands(moduleInstance),
      this.addAutoComplete(moduleInstance),
    ]);
  }

  private getModuleName(module: AbstractModule) {
    return String(module.options.name || module.constructor.name.toLowerCase());
  }

  private async addModule(module: AbstractModule) {
    this.client.options.modules!.set(this.getModuleName(module), {
      isEnabled: true,
      module: module,
    });
  }

  /**
   * Add events from the module to the client's cache.
   */
  private async addEvents(module: AbstractModule): Promise<void> {
    // Implement event handling logic here
  }

  /**
   * Add commands from the module to the client's cache.
   */
  private async addCommands(module: AbstractModule): Promise<void> {
    // Implement command handling logic here
  }

  /**
   * Add auto-complete handlers from the module to the client's cache.
   */
  private async addAutoComplete(module: AbstractModule): Promise<void> {
    // Implement auto-complete handling logic here
  }
}
