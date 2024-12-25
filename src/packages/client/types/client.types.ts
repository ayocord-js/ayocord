import {
  BitFieldResolvable,
  ClientOptions,
  Collection,
  GatewayIntentsString,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import {
  IAutoCompleteOptions,
  IComponentOptions,
  IEventOptions,
  ISlashCommandOptions,
  ITextCommandOptions,
} from "../../interactions/decorators/methods";
import { IModuleOptions } from "@/packages/modules/decorators";

export interface IModule {
  isEnabled: boolean;
  module: IModuleOptions;
}

export type DiscordExecutor = (...args: unknown[]) => Promise<any>;

export interface IDiscordEntity {
  module: IModuleOptions;
  executor: any;
}

export interface IEventEntity extends IDiscordEntity {
  options: IEventOptions;
}

export enum CommandType {
  SLASH = 0,
  TEXT = 1,
}

export interface ICommandEntity extends IDiscordEntity {
  options: ISlashCommandOptions;
}

export interface IAutoCompleteEntity extends IDiscordEntity {
  options: IAutoCompleteOptions;
}

export interface IComponentEntity extends IDiscordEntity {
  options: IComponentOptions;
}

export type ModuleCollection = Collection<string, IModule>;
export type CommandCollection = Collection<string, ICommandEntity>;
export type EventCollection = Collection<string, IEventEntity>;
export type AutoCompleteCollection = Collection<string, IAutoCompleteEntity>;
export type ComponentCollection = Collection<string, IComponentEntity>;

export interface ISynchronizeOptions {
  /**
   * Using for synchronize global commands from SlashCommand decorator
   */
  global?: boolean;
  /**
   * Using for synchronize guild commands from SlashCommand decorator options
   */
  guild?: boolean;
}

export interface IDiscordClientOptions extends ClientOptions {
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  /**
   * Discord Bot token
   */
  token: string;
  /**
   * How you call your ship then he swim
   */
  applicationName?: string;
  /**
   * The version of your bot
   * You can access this property for show it your users (by default undefined)
   */
  version?: string;
  /**
   * Who created this bot
   */
  devs?: Snowflake[];
  /**
   * Would you like to use custom logger or our ayologger - your choice
   */
  logger?: InstanceType<typeof Logger> | Logger; // Инстанс или объект наследника
  /**
   * Used for text commands
   */
  prefix?: string;
  /**
   * By default synchronize is enabled
   * 
   * Using for synchronize global or guild commands
   *
   * If you want to use your custom command register handler. Use client.commands collection for getting commands
   */
  synchronize?: ISynchronizeOptions;
  /**
   * Collection of modules
   */
  modules?: ModuleCollection;
  /**
   * Collection of Commands from modules
   */
  slashCommands?: CommandCollection;
  /**
   * Collection of events
   */
  events?: EventCollection;
  /**
   * Collection of auto-completes
   */
  autoComplete?: AutoCompleteCollection;
}
