import {
  BitFieldResolvable,
  ClientOptions,
  Collection,
  GatewayIntentsString,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import { AbstractModule } from "@/abstractions/module.abstract";

export interface IModule {
  isEnabled: boolean;
  module: AbstractModule;
}

export type DiscordExecutor = () => Promise<any>;

export interface ICommand {
  module: keyof IDiscordClientOptions["modules"];
  executor: DiscordExecutor;
}

export interface IEvent {
  module: keyof IDiscordClientOptions["modules"];
  executor: DiscordExecutor;
}

export interface IAutoComplete {
  module: keyof IDiscordClientOptions["modules"];
  executor: DiscordExecutor;
}

export type ModuleCollection = Collection<string, IModule>;
export type CommandCollection = Collection<string, ICommand>;
export type EventCollection = Collection<string, IEvent>;
export type AutoCompleteCollection = Collection<string, IAutoComplete>;

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
