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
import { IViewOptions } from "@/packages/views";
import { IBaseViewComponent } from "@/packages/views/types";

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

export interface IViewEntity extends IDiscordEntity {
  options: { view: IViewOptions; component: IBaseViewComponent<any> };
}

export type ModuleCollection = Collection<string, IModule>;
export type SlashCommandCollection = Collection<string, ISlashCommandEntity>;
export type EventCollection = Collection<string, IEventEntity>;
export type AutoCompleteCollection = Collection<string, IAutoCompleteEntity>;
export type ComponentCollection = Collection<string, IComponentEntity>;
export type TextCommandCollection = Collection<string, ITextCommandEntity>;
export type SubCommandCollection = Collection<string, ISubCommandEntity>;
export type ViewCollection = Collection<string, IViewEntity>;

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

export interface IDiscordClientHandler {
  /**
   * For commands, sub commands, component interactions, context menus
   */
  interaction?: Function;
  textCommand?: Function;
  event?: Function;
}

export interface IDiscordClientCollector {
  auto?: boolean;
  /**
   * Modules that you want to connect
   */
  modules?: any[];
}

// @ts-ignore
export interface IDiscordClientOptions extends ClientOptions {
  readonly intents?: BitFieldResolvable<GatewayIntentsString, number>;
  /**
   * Discord Bot token
   */
  readonly token?: string;
  /**
   * How you call your ship then he swim
   */
  readonly applicationName?: string;
  /**
   * Internal option, I recommend not touch this
   */
  readonly type?: ClientType
  /**
   * The version of your bot
   * You can access this property for show it your users (by default undefined)
   */
  readonly version?: string;
  /**
   * Who created this bot
   */
  readonly devs?: Snowflake[];
  /**
   * Would you like to use custom logger or our ayologger - your choice
   */
  readonly logger?: InstanceType<typeof Logger> | Logger; // Инстанс или объект наследника
  /**
   * Used for text commands
   */
  readonly prefix?: string;
  /**
   * By default synchronize is enabled
   *
   * Using for synchronize global or guild commands
   *
   * If you want to use your custom command register handler. Use client.commands collection for getting commands
   */
  readonly synchronize?: ISynchronizeOptions;
  /**
   * Collection of modules
   */
  readonly modules?: ModuleCollection;
  /**
   * Collection of SlashCommands from modules
   */
  readonly slashCommands?: SlashCommandCollection;
  /**
   * Collection of TextCommands
   */
  readonly textCommands?: TextCommandCollection;
  /**
   * Collection of events
   */
  readonly events?: EventCollection;
  /**
   * Collection of auto-completes
   */
  readonly autoComplete?: AutoCompleteCollection;

  readonly collector?: IDiscordClientCollector;
  /**
   * Your custom handlers implementation
   */
  readonly handlers?: IDiscordClientHandler;
  /**
   * Needs when you want to enable or disable your bot
   * For example, this option can be used for development bot or you want check if this bot online
   */
  readonly enabled: boolean
}

export type TEntity =
  | IAutoCompleteEntity
  | IEventEntity
  | IComponentEntity
  | ITextCommandEntity
  | ISlashCommandEntity;

export type ClientType = "multitoken" | "singletoken"
