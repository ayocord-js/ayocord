import { Client, IntentsBitField } from "discord.js";
import { IDiscordClientOptions } from "./discord-client.types";

export class DiscordClient extends Client {
  public options: Omit<IDiscordClientOptions, "intents"> & {
    intents: IntentsBitField;
  };
  constructor(
    options: Omit<IDiscordClientOptions, "intents"> & {
      intents: IntentsBitField;
    }
  ) {
    super(options);
    this.options = options;
  }

  private checkExistedModule(name: string) {
    const module = this.options.modules?.[name];
    if (!module) throw new Error("Module with this name does not exists");
    return module;
  }

  /**
   * We recommend you use it for developer command!
   */
  async moduleEnable(name: string) {
    const module = this.checkExistedModule(name);
    this.options.modules![name] = { ...module, isEnabled: true };
    // after and before enabled
    await module.module.onEnable(this);
  }

  /**
   * We recommend you use it for developer command!
   */
  async moduleDisable(name: string) {
    const module = this.checkExistedModule(name);
    if (!module) return;
    this.options.modules![name] = { ...module, isEnabled: false };
    // after and before enabled
    await module.module.onDisable(this);
  }
}
