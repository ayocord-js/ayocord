import { DiscordClient, IModule } from "@/packages/client";
import { ModuleMetadataKeys } from "@/shared";
import { DiscordModule } from "../types";

export class ModuleUtility {
  client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  private processModule(module: string | Function): IModule | null {
    const moduleName =
      typeof module === "string"
        ? module
        : Reflect.getMetadata(ModuleMetadataKeys.MODULE, module.prototype)
            ?.name;

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

  public async moduleEnable(name: string | Function) {
    const module = this.processModule(name);
    const instance = module?.instance as DiscordModule;

    if (!module) {
      return;
    }

    if (module.isEnabled) {
      return;
    }

    if (instance.onEnable) {
      await instance.onEnable(this.client);
    }

    await Promise.all([
      this.client.modules.set(module.module.name, {
        ...module,
        isEnabled: true,
      }),
      this.manageEvents(module, true),
    ]);
    return true;
  }

  public async moduleDisable(name: string | Function) {
    const module = this.processModule(name);
    const instance = module?.instance as DiscordModule;

    if (!module) {
      return;
    }

    if (!module.isEnabled) {
      return;
    }

    if (instance.onDisable) {
      await instance.onDisable(this.client);
    }

    await Promise.all([
      this.client.modules.set(module.module.name, {
        ...module,
        isEnabled: false,
      }),
      this.manageEvents(module, false),
    ]);
    return true;
  }

  public getModules() {
    return this.client.modules;
  }

  public getEnabledModules() {
    return this.getModules().filter((module) => module.isEnabled);
  }

  public getDisabledModules() {
    return this.getModules().filter((module) => !module.isEnabled);
  }

  public getModuleByName(name: string) {
    return this.getModules().find(
      (mod) => mod.module.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
