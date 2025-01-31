import {
  Client,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import {
  AutoCompleteCollection,
  SlashCommandCollection,
  ComponentCollection,
  EventCollection,
  IDiscordClientOptions,
  ISynchronizeOptions,
  ModuleCollection,
  SubCommandCollection,
  TextCommandCollection,
  IDiscordClientCollector,
  IDiscordClientHandler,
  ViewCollection,
} from "./types/client.types";
import { ConfigUtility } from "../utils";
import { CommandUtility } from "../slash-commands";
import {
  EventHandler,
  handlers,
  InteractionHandler,
  TextCommandHandler,
} from "./handlers";

/**
 * Custom Discord Client class that extends the base Client functionality.
 * Includes support for modular architecture, command collections, and enhanced logging.
 */
export class DiscordClient extends Client {
  public modules: ModuleCollection;
  public slashCommands: SlashCommandCollection;
  public subCommands: SubCommandCollection;
  public events: EventCollection;
  public components: ComponentCollection;
  /**
   * Same components but wrapped on view decorator
   */
  public views: ViewCollection;
  public autoComplete: AutoCompleteCollection;
  public textCommands: TextCommandCollection;
  public applicationName?: string;
  public version?: string;
  public devs?: Snowflake[];
  public logger?: InstanceType<typeof Logger> | Logger;
  public prefix?: string;
  public synchronize?: ISynchronizeOptions;
  public token: string | null;
  public collector?: IDiscordClientCollector;
  public handlers: IDiscordClientHandler;

  /**
   * Initializes a new instance of DiscordClient.
   * @param options - Options for configuring the client, including modules, commands, and logger.
   */
  constructor(options: IDiscordClientOptions) {
    super({ ...options, intents: options.intents ?? [] });

    this.modules = new Collection();
    this.events = new Collection();
    this.slashCommands = new Collection();
    this.autoComplete = new Collection();
    this.components = new Collection();
    this.textCommands = new Collection();
    this.subCommands = new Collection();
    this.views = new Collection();

    this.handlers = options.handlers
      ? {
          ...handlers,
          ...options.handlers,
        }
      : handlers;
    this.collector = options.collector;

    this.applicationName = options.applicationName;
    this.version = options.version;
    this.devs = options.devs;
    this.logger = options.logger ?? new Logger();
    this.prefix = options.prefix;
    this.synchronize = options.synchronize ?? { global: true, guild: true };
    this.token = options.token ?? null;
  }

  /**
   * Registers global slash commands for the bot.
   * @param commands - An array of SlashCommandBuilder instances to register.
   */
  async registerGlobalCommands(commands: SlashCommandBuilder[]) {
    const rest = new REST({ version: "10" }).setToken(this.token || "");
    try {
      await rest.put(Routes.applicationCommands(this.user!.id), {
        body: commands,
      });
      if (commands.length >= 1) {
        return commands;
      }
    } catch (e) {
      this.logger?.error(`Failed to register global commands: ${e}`);
    }
  }

  /**
   * Registers slash commands for a specific guild.
   * @param guildId - The ID of the guild where the commands will be registered.
   * @param commands - An array of SlashCommandBuilder instances to register.
   */
  async registerGuildCommands(
    guildId: Snowflake,
    commands: SlashCommandBuilder[]
  ) {
    const rest = new REST({ version: "10" }).setToken(this.token || "");
    try {
      await rest.put(Routes.applicationGuildCommands(this.user!.id, guildId), {
        body: commands,
      });
      return commands;
    } catch (e) {
      this.logger?.error(
        `Failed to register guild commands for ${guildId}: ${e}`
      );
    }
  }

  /**
   * Logs the client in and synchronizes commands if enabled.
   */
  public async login(token?: string): Promise<string> {
    try {
      await super.login(token || this.token || "");
      if (token) {
        this.token = token;
      }
    } catch (e) {
      this.logger?.error(e);
      return "fail";
    }

    try {
      await this.synchronizeCommands();
    } catch (e) {
      this.logger?.error(e);
    }

    return "success";
  }

  private async synchronizeCommands() {
    const commands = await CommandUtility.getCommands(this, this.slashCommands);
    await CommandUtility.synchronize(this, commands, true);
  }

  /**
   * Unregisters specific guild slash commands by comparing the provided commands with the existing ones.
   * @param guildId - The ID of the guild where the commands will be unregistered.
   * @param commands - An array of SlashCommandBuilder instances to unregister.
   * @param token - The bot token for authentication.
   */
  async unRegisterGuildCommands(
    guildId: Snowflake,
    commands: SlashCommandBuilder[]
  ) {
    const rest = new REST({ version: "10" }).setToken(this.token || "");

    try {
      // Fetch existing commands from the guild
      const existingCommands: any[] = (await rest.get(
        Routes.applicationGuildCommands(this.user!.id, guildId)
      )) as any[];

      // Extract command names from the provided builders
      const commandNamesToRemove = commands.map((command) => command.name);

      // Filter existing commands to keep only those not in the removal list
      const updatedCommands = existingCommands.filter(
        (cmd) => !commandNamesToRemove.includes(cmd.name)
      );

      // Update the guild's commands with the filtered list
      await rest.put(Routes.applicationGuildCommands(this.user!.id, guildId), {
        body: updatedCommands,
      });
    } catch (e) {
      this.logger?.error(
        `Failed to unregister guild commands for ${guildId}: ${e}`
      );
    }
  }

  async unRegisterGlobalCommands(commands: SlashCommandBuilder[]) {
    const rest = new REST({ version: "10" }).setToken(this.token || "");

    try {
      // Fetch existing commands from the guild
      const existingCommands: any[] = (await rest.get(
        Routes.applicationCommands(this.user!.id)
      )) as any[];

      // Extract command names from the provided builders
      const commandNamesToRemove = commands.map((command) => command.name);

      // Filter existing commands to keep only those not in the removal list
      const updatedCommands = existingCommands.filter(
        (cmd) => !commandNamesToRemove.includes(cmd.name)
      );

      // Update the guild's commands with the filtered list
      await rest.put(Routes.applicationCommands(this.user!.id), {
        body: updatedCommands,
      });

      return updatedCommands;
    } catch (e) {
      this.logger?.error(`Failed to unregister global commands: ${e}`);
    }
  }
}
