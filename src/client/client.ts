import { Client, Collection } from "discord.js";
import {
  IAutoCompleteEntity,
  ICommandEntity,
  IDiscordClientOptions,
  IEventEntity,
  IModule,
} from "./types/client.types";

export class DiscordClient extends Client {
  /**
   * IDK how to correctly use types here
   */
  // @ts-ignore
  public options: IDiscordClientOptions;

  constructor(options: IDiscordClientOptions) {
    super({ ...options });

    this.options = { ...options };
    this.options.modules = new Collection<string, IModule>();
    this.options.events = new Collection<string, IEventEntity>();
    this.options.commands = new Collection<string, ICommandEntity>();
    this.options.autoComplete = new Collection<string, IAutoCompleteEntity>();
  }

  private checkExistedModule(name: string) {
    const module = this.options.modules?.get(name);
    if (!module) throw new Error("Module with this name does not exist.");
    return module;
  }

  /**
   * We recommend you use it for developer commands!
   */
  async moduleEnable(name: string) {
    const module = this.checkExistedModule(name);
    this.options.modules!.set(name, { ...module, isEnabled: true });

    await module.module.onEnable(this);
  }

  /**
   * We recommend you use it for developer commands!
   */
  async moduleDisable(name: string) {
    const module = this.checkExistedModule(name);
    if (!module) return;

    this.options.modules!.set(name, { ...module, isEnabled: false });

    await module.module.onDisable(this);
  }
}
