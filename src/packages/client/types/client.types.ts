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
} from "../../interactions/decorators";
import { IModuleOptions } from "@/packages/modules/decorators";
import { ISubCommandOptions } from "@/packages/interactions/decorators/sub-command.decorator";
import { ConfigUtility } from "@/packages/utils";

export interface IModule {
  isEnabled: boolean;
  instance: Function;
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

export interface ISlashCommandEntity extends IDiscordEntity {
  options: ISlashCommandOptions;
}

export interface IAutoCompleteEntity extends IDiscordEntity {
  options: IAutoCompleteOptions;
}

export interface IComponentEntity extends IDiscordEntity {
  options: IComponentOptions;
}

export interface ITextCommandEntity extends IDiscordEntity {
  options: ITextCommandOptions;
}

export interface ISubCommandEntity extends IDiscordEntity {
  options: ISubCommandOptions;
}

export type ModuleCollection = Collection<string, IModule>;
export type CommandCollection = Collection<string, ISlashCommandEntity>;
export type EventCollection = Collection<string, IEventEntity>;
export type AutoCompleteCollection = Collection<string, IAutoCompleteEntity>;
export type ComponentCollection = Collection<string, IComponentEntity>;
export type TextCommandCollection = Collection<string, ITextCommandEntity>;
export type SubCommandCollection = Collection<string, ISubCommandEntity>;

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
   *
   * By default instance of ConfigUtility class
   */
  config?: ConfigUtility;
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
   * Collection of SlashCommands from modules
   */
  slashCommands?: CommandCollection;
  /**
   * Collection of TextCommands
   */
  textCommands?: TextCommandCollection;
  /**
   * Collection of events
   */
  events?: EventCollection;
  /**
   * Collection of auto-completes
   */
  autoComplete?: AutoCompleteCollection;
}

export type TEntity =
  | IAutoCompleteEntity
  | IEventEntity
  | IComponentEntity
  | ITextCommandEntity
  | ISlashCommandEntity;
