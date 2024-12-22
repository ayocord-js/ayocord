import { DiscordClient } from "@/discord/discord.client";

export interface IModuleOptions {
  name?: string;
  isDev?: boolean;
}

export interface IModule {
  options: IModuleOptions;

  onEnable?(client: DiscordClient): unknown;
  onDisable?(client: DiscordClient): unknown;
}

export class AbstractModule implements IModule {
  options: IModuleOptions;
  constructor(options: IModuleOptions) {
    this.options = options;
  }

  /**=============================================
   * Lifecycle
   * onLoad -> onEnable -> onDisable->onUnload
   * by default onInit will load all commands/Events/Modals and this method cannot be extend
   =============================================*/
  public onLoad(client: DiscordClient): unknown {
    throw new Error("Method not implemented.");
  }

  /**=============================================
   * Lifecycle
   * onLoad -> onEnable -> onDisable->onUnload
   * by default onInit will load all commands/Events/Modals and this method cannot be extend
   =============================================*/
  public onUnload(client: DiscordClient): unknown {
    throw new Error("Method not implemented.");
  }

  /**=============================================
   * Lifecycle
   * onEnable -> onDisable
   * by default onInit will load all commands/Events/Modals and this method cannot be extend
   =============================================*/
  public onEnable(client: DiscordClient): unknown {
    throw new Error("Method not implemented.");
  }

  /**=============================================
   * Lifecycle
   * onEnable -> onDisable
   * by default onInit will load all commands/Events/Modals and this method cannot be extend
   =============================================*/
  public onDisable(client: DiscordClient): unknown {
    throw new Error("Method not implemented.");
  }
}
