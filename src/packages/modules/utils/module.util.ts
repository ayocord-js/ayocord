import { DiscordClient, IModule } from "@/packages/client";
import { ModuleMetadataKeys } from "@/shared";
import { CommandUtility } from "@/packages/slash-commands";
import { DiscordModule } from "../types";

/** Utility for managing modules */
export class ModuleUtility {
  client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  private processModule(module: string | Function): IModule | null {
    const moduleName =
      typeof module === "string"
        ? module
        : Reflect.getMetadata(ModuleMetadataKeys.MODULE, module.prototype)?.name;

    if (!moduleName) return null;
    return this.client.modules.get(moduleName) || null;
  }

  private manageEvents(module: IModule, enable: boolean) {
    this.client.events
      .filter((event) => event.module.name === module.module.name)
      .forEach((event) => {
        const { options, executor } = event;
        if (enable) {
          if (options.once) {
            this.client.once(options.name, executor);
          } else {
            this.client.on(options.name, executor);
          }
        } else {
          this.client.removeListener(options.name, executor);
        }
      });
  }

  private async manageCommands(module: IModule, register: boolean) {
    const commands = await CommandUtility.getCommands(
      this.client,
      this.client.slashCommands.filter(
        (command) => command.module.name === module.module.name
      )
    );
    await CommandUtility.synchronize(this.client, commands, register);
  }

  async moduleEnable(name: string | Function) {
    const module = this.processModule(name);
    const instance = module?.instance as DiscordModule;
    if (instance.onEnable) {
      return await instance.onEnable(this.client);
    }
    if (!module) {
      return;
    }

    if (module.isEnabled) {

      return;
    }

    await Promise.all([
      this.client.modules.set(module.module.name, {
        ...module,
        isEnabled: true,
      }),
      this.manageEvents(module, true),
      this.manageCommands(module, true),
    ]);
    return true;
  }

  async moduleDisable(name: string | Function) {
    const module = this.processModule(name);
    const instance = module?.instance as DiscordModule;
    if (instance.onDisable) {
      return await instance.onDisable(this.client);
    }
    if (!module) {

      return;
    }

    if (!module.isEnabled) {
      return;
    }

    await Promise.all([
      this.client.modules.set(module.module.name, {
        ...module,
        isEnabled: false,
      }),
      this.manageEvents(module, false),
      await this.manageCommands(module, false),
    ]);
    return true;
  }
}
