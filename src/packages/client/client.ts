import {
  ApplicationCommand,
  Client,
  Collection,
  REST,
  Routes,
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
  ClientType,
  AyocordSlashCommandBuilder,
} from "@/packages";
import { CommandUtility } from "@/packages";
import {
  handlers,
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
  public autoComplete: AutoCompleteCollection;
  public textCommands: TextCommandCollection;
  /**
   * Same components but wrapped on view decorator
   */
  public views: ViewCollection;

  public type?: ClientType
  public enabled?: boolean
  public applicationName?: string;
  public version?: string;
  public devs?: Snowflake[];
  public logger?: InstanceType<typeof Logger> | Logger;
  public prefix?: string;
  public token: string | null;
  public synchronize?: ISynchronizeOptions;
  public collector?: IDiscordClientCollector;
  public handlers?: IDiscordClientHandler;


  /**
   * Initializes a new instance of DiscordClient.
   * @param options - Options for configuring the client, including modules, commands, and logger.
   */
  constructor(options: IDiscordClientOptions) {
    super({ ...options, intents: options.intents ?? [] });

    this.type = typeof options.type === "undefined" ? "singletoken" : options.type
    this.enabled = typeof options.enabled === "undefined" ? true : options.enabled
    this.modules = new Collection();
    this.events = new Collection();
    this.slashCommands = new Collection();
    this.autoComplete = new Collection();
    this.components = new Collection();
    this.textCommands = new Collection();
    this.subCommands = new Collection();
    this.views = new Collection();
    this.enabled = options.enabled === undefined ? true : options.enabled;

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
  public async registerGlobalCommands(commands: AyocordSlashCommandBuilder[]) {
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
  public async registerGuildCommands(
    guildId: Snowflake,
    commands: AyocordSlashCommandBuilder[]
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

    if (!this.enabled && this.type === "singletoken") {
      throw new Error("Main client is disabled");
    }

    try {
      if (token) {
        this.token = token;
      }
      await super.login(this.token!);
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
  public async unRegisterGuildCommands(
    guildId: Snowflake,
    commands: AyocordSlashCommandBuilder[]
  ) {
    const rest = new REST({ version: "10" }).setToken(this.token || "");

    try {
      // Fetch existing commands from the guild
      const existingCommands: ApplicationCommand[] = (await rest.get(
        Routes.applicationGuildCommands(this.user!.id, guildId)
      )) as ApplicationCommand[];

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

  public async unRegisterGlobalCommands(commands: AyocordSlashCommandBuilder[]) {
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
