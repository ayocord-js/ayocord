import {
  Client,
  Collection,
  ClientOptions,
  GatewayIntentsString,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import { AbstractModule } from "@/abstractions/module.abstract";
import {
  AutoCompleteCollection,
  CommandCollection,
  EventCollection,
  IDiscordClientOptions,
  ModuleCollection,
} from "./types/client.types";

export class DiscordClient extends Client {
  public modules: ModuleCollection;
  public commands: CommandCollection;
  public events: EventCollection;
  public autoComplete: AutoCompleteCollection;
  public applicationName?: string;
  public version?: string;
  public loader?: {
    auto?: {
      isEnabled: boolean;
      parentClass?: typeof AbstractModule;
    };
    moduleDir?: string;
  };
  public devs?: Snowflake[];
  public logger?: typeof Logger;
  public prefix?: string;

  constructor(options: IDiscordClientOptions) {
    super({
      ...options,
    });

    this.modules = new Collection();
    this.events = new Collection();
    this.commands = new Collection();
    this.autoComplete = new Collection();

    this.applicationName = options.applicationName;
    this.version = options.version;
    this.loader = options.loader;
    this.devs = options.devs;
    this.logger = options.logger;
    this.prefix = options.prefix;
  }

  private checkExistedModule(name: string) {
    const module = this.modules.get(name);
    if (!module) throw new Error("Module with this name does not exist.");
    return module;
  }

  async moduleEnable(name: string) {
    const module = this.checkExistedModule(name);
    this.modules.set(name, { ...module, isEnabled: true });
    await module.module.onEnable(this);
  }

  async moduleDisable(name: string) {
    const module = this.checkExistedModule(name);
    if (!module) return;
    this.modules.set(name, { ...module, isEnabled: false });
    await module.module.onDisable(this);
  }
}
