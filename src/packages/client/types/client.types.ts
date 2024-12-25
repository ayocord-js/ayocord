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
  type: CommandType;
  options: ISlashCommandOptions | ITextCommandOptions;
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

export interface IDiscordClientOptions extends ClientOptions {
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  /**
   * How you call your sheep then he swim
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
  logger?: typeof Logger;
  /**
   * Used for text commands
   */
  prefix?: string;
  /**
   * Collection of modules
   */
  modules?: ModuleCollection;
  /**
   * Collection of Commands from modules
   */
  commands?: CommandCollection;
  /**
   * Collection of events
   */
  events?: EventCollection;
  /**
   * Collection of auto-completes
   */
  autoComplete?: AutoCompleteCollection;
}
