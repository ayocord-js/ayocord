import { ClientOptions, Snowflake } from "discord.js";
import { Logger } from "ayologger";
import { AbstractModule } from "@/abstractions/module.abstract";

export interface IModule {
  isEnabled: boolean;
  module: AbstractModule;
}

export type ModuleCollection = Record<string, IModule>;

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

export type CommandCollection = Record<string, ICommand>;
export type EventCollection = Record<string, IEvent>;
export type AutoCompleteCollection = Record<string, IAutoComplete>;

export interface IDiscordClientOptions extends ClientOptions {
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
     * Path to you module dir
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