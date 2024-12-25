import {
  Client,
  Collection,
  ClientOptions,
  GatewayIntentsString,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import {
  AutoCompleteCollection,
  CommandCollection,
  ComponentCollection,
  EventCollection,
  IDiscordClientOptions,
  ModuleCollection,
} from "./types/client.types";

export class DiscordClient extends Client {
  public modules: ModuleCollection;
  public commands: CommandCollection;
  public events: EventCollection;
  public components: ComponentCollection
  public autoComplete: AutoCompleteCollection;
  public applicationName?: string;
  public version?: string;
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
    this.components = new Collection()

    this.applicationName = options.applicationName;
    this.version = options.version;
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
  }

  async moduleDisable(name: string) {
    const module = this.checkExistedModule(name);
    if (!module) return;
    this.modules.set(name, { ...module, isEnabled: false });
  }
}
