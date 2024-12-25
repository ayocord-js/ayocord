import {
  Client,
  Collection,
  Guild,
  OAuth2Guild,
  REST,
  Routes,
  SlashCommandBuilder,
  Snowflake,
} from "discord.js";
import { Logger } from "ayologger";
import {
  AutoCompleteCollection,
  CommandCollection,
  ComponentCollection,
  EventCollection,
  IDiscordClientOptions,
  ISynchronizeOptions,
  ModuleCollection,
} from "./types/client.types";
import { ISlashCommandOptions } from "../interactions";

/**
 * Custom Discord Client class that extends the base Client functionality.
 * Includes support for modular architecture, command collections, and enhanced logging.
 */
export class DiscordClient extends Client {
  public modules: ModuleCollection;
  public slashCommands: CommandCollection;
  public events: EventCollection;
  public components: ComponentCollection;
  public autoComplete: AutoCompleteCollection;
  public applicationName?: string;
  public version?: string;
  public devs?: Snowflake[];
  public logger?: InstanceType<typeof Logger> | Logger;
  public prefix?: string;
  public synchronize?: ISynchronizeOptions;
  public token: string;

  /**
   * Initializes a new instance of DiscordClient.
   * @param options - Options for configuring the client, including modules, commands, and logger.
   */
  constructor(options: IDiscordClientOptions) {
    super({ ...options });

    this.modules = new Collection();
    this.events = new Collection();
    this.slashCommands = new Collection();
    this.autoComplete = new Collection();
    this.components = new Collection();

    this.applicationName = options.applicationName;
    this.version = options.version;
    this.devs = options.devs;
    this.logger = options.logger ?? new Logger();
    this.prefix = options.prefix;
    this.synchronize = options.synchronize ?? { global: true, guild: true };
    this.token = options.token;
  }

  /**
   * Registers global slash commands for the bot.
   * @param commands - An array of SlashCommandBuilder instances to register.
   */
  async registerGlobalCommands(commands: SlashCommandBuilder[]) {
    const rest = new REST({ version: "10" }).setToken(this.token);
    try {
      await rest.put(Routes.applicationCommands(this.user!.id), {
        body: commands,
      });
      this.logger?.success(
        `Successfully registered ${commands.length} global command(s).`
      );
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
    const rest = new REST({ version: "10" }).setToken(this.token);
    try {
      await rest.put(Routes.applicationGuildCommands(this.user!.id, guildId), {
        body: commands,
      });
      this.logger?.success(
        `Successfully registered ${commands.length} command(s) for guild with ID: ${guildId}.`
      );
    } catch (e) {
      this.logger?.error(
        `Failed to register guild commands for ${guildId}: ${e}`
      );
    }
  }

  /**
   * Logs the client in and synchronizes commands if enabled.
   */
  public async login(): Promise<string> {
    try {
      await super.login(this.token);
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
    /**
     * By default synchronize is enabled
     */
    const promises = [];
    if (this.synchronize?.global) {
      const commands = [] as SlashCommandBuilder[];
      for (const [_, command] of this.slashCommands) {
        const synchronize = command.options.synchronize
          ? command.options.synchronize.useAsync
            ? await command.options.synchronize.useAsync()
            : command.options.synchronize.options
          : { guilds: [], global: true };
        if (synchronize?.global) {
          commands.push(command.options.builder);
        }
      }
      try {
        promises.push(this.registerGlobalCommands(commands));
      } catch (e) {
        this.logger?.error(e);
      }
    }
    if (this.synchronize?.guild) {
      const guilds = await this.guilds.fetch();
      for (const [_, guild] of guilds) {
        const commands = [] as SlashCommandBuilder[];
        for (const [_, command] of this.slashCommands) {
          const synchronize = command.options.synchronize
            ? command.options.synchronize.useAsync
              ? await command.options.synchronize.useAsync()
              : command.options.synchronize.options
            : { guilds: [], global: true };

          if (synchronize?.guilds.includes(guild.id)) {
            commands.push(command.options.builder);
          }
        }
        try {
          promises.push(this.registerGuildCommands(guild.id, commands));
        } catch (e) {
          this.logger?.error(e);
        }
      }
    }
    await Promise.all(promises);
  }
}
