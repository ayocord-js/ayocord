import { Client, IntentsBitField } from "discord.js";
import { IDiscordClientOptions } from "./discord-client.types";

export class DiscordClient extends Client {
  /**
   * IDK how to correctly use types here
   */
  // @ts-ignore
  public options: IDiscordClientOptions;

  constructor(options: IDiscordClientOptions) {
    super({ ...options });

    this.options = { ...options };
  }

  private checkExistedModule(name: string) {
    const module = this.options.modules?.[name];
    if (!module) throw new Error("Module with this name does not exist.");
    return module;
  }

  /**
   * We recommend you use it for developer commands!
   */
  async moduleEnable(name: string) {
    const module = this.checkExistedModule(name);
    this.options.modules![name] = { ...module, isEnabled: true };

    await module.module.onEnable(this);
  }

  /**
   * We recommend you use it for developer commands!
   */
  async moduleDisable(name: string) {
    const module = this.checkExistedModule(name);
    if (!module) return;

    this.options.modules![name] = { ...module, isEnabled: false };

    await module.module.onDisable(this);
  }
}
