import {
  BitFieldResolvable,
  ClientOptions,
  Collection,
  GatewayIntentsString,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import { AbstractModule } from "@/abstractions/module.abstract";
import {
  IAutoCompleteOptions,
  IEventOptions,
  ISlashCommandOptions,
  ITextCommandOptions,
} from "../decorators";

export interface IModule {
  isEnabled: boolean;
  module: AbstractModule;
}

export type DiscordExecutor = (...args: unknown[]) => Promise<any>;

export interface IDiscordEntity {
  module: AbstractModule;
  executor: DiscordExecutor;
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

export type ModuleCollection = Collection<string, IModule>;
export type CommandCollection = Collection<string, ICommandEntity>;
export type EventCollection = Collection<string, IEventEntity>;
export type AutoCompleteCollection = Collection<string, IAutoCompleteEntity>;

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
   * How Client should load your modules. We recomend you use Auto mode or use your custom class. It's easier <3
   */
  loader?: {
    auto?: {
      /**
       * Why required? Because I want!
       */
      isEnabled: boolean;
      /**
       * The class from which can be extend your module
       */
      parentClass?: typeof AbstractModule;
    };
    /**
     * Path to your module dir
     */
    moduleDir?: string;
  };
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
