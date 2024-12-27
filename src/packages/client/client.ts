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
  CommandCollection,
  ComponentCollection,
  EventCollection,
  IDiscordClientOptions,
  ISynchronizeOptions,
  ModuleCollection,
  SubCommandCollection,
  TextCommandCollection,
} from "./types/client.types";

/**
 * Custom Discord Client class that extends the base Client functionality.
 * Includes support for modular architecture, command collections, and enhanced logging.
 */
export class DiscordClient extends Client {
  public modules: ModuleCollection;
  public slashCommands: CommandCollection;
  public subCommands: SubCommandCollection;
  public events: EventCollection;
  public components: ComponentCollection;
  public autoComplete: AutoCompleteCollection;
  public textCommands: TextCommandCollection;
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
    this.textCommands = new Collection();
    this.subCommands = new Collection();

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
      if (commands.length >= 1) {
        this.logger?.success(
          `Successfully registered ${commands.length} global command(s).`
        );
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
    const rest = new REST({ version: "10" }).setToken(this.token);
    try {
      await rest.put(Routes.applicationGuildCommands(this.user!.id, guildId), {
        body: commands,
      });
      if (commands.length >= 1) {
        this.logger?.success(
          `Successfully registered ${commands.length} command(s) for guild with ID: ${guildId}.`
        );
      }
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

  /**
   * Synchronizes the slash commands across global and guild-specific contexts
   * based on the synchronization options provided. It registers global commands
   * if synchronization is enabled for global use, and registers guild-specific
   * commands if synchronization is enabled for specific guilds.
   *
   * The method first checks the `synchronize` configuration. If `global` is enabled,
   * it collects all commands that are marked for global synchronization and registers
   * them globally. If `guild` is enabled, it fetches all guilds and registers the commands
   * that are marked for synchronization within those specific guilds.
   *
   * Each command's `synchronize` property is examined to determine if it should be registered
   * globally or within specific guilds. This allows flexible control over where commands should
   * be available.
   *
   * The method uses `Promise.all` to execute command registration for both global and guild
   * contexts concurrently, ensuring efficient handling of multiple command registrations.
   *
   * @returns {Promise<void>} A promise that resolves when all commands have been synchronized
   * across global and guild contexts, or rejects if an error occurs during registration.
   *
   * @private
   */
  private async synchronizeCommands() {
    const promises = [];

    // If global synchronization is enabled, register global commands
    if (this.synchronize?.global) {
      const commands = [] as SlashCommandBuilder[];

      // Iterate over all slash commands
      for (const [_, command] of this.slashCommands) {
        // Determine synchronization settings for the command
        const synchronize = command.options.synchronize
          ? command.options.synchronize.useAsync
            ? await command.options.synchronize.useAsync()
            : command.options.synchronize.options
          : { guilds: [], global: true };

        // If the command is marked for global synchronization, add to global commands list
        if (synchronize?.global) {
          commands.push(command.options.builder);
        }
      }

      // Register global commands
      try {
        promises.push(this.registerGlobalCommands(commands));
      } catch (e) {
        this.logger?.error(e);
      }
    }

    // If guild-specific synchronization is enabled, register commands for each guild
    if (this.synchronize?.guild) {
      const guilds = await this.guilds.fetch();

      // Iterate over all fetched guilds
      for (const [_, guild] of guilds) {
        const commands = [] as SlashCommandBuilder[];

        // Iterate over all slash commands
        for (const [_, command] of this.slashCommands) {
          // Determine synchronization settings for the command
          const synchronize = command.options.synchronize
            ? command.options.synchronize.useAsync
              ? await command.options.synchronize.useAsync()
              : command.options.synchronize.options
            : { guilds: [], global: true };

          // If the command is marked for this specific guild, add to guild commands list
          if (synchronize?.guilds.includes(guild.id)) {
            commands.push(command.options.builder);
          }
        }

        // Register guild-specific commands for each guild
        try {
          promises.push(this.registerGuildCommands(guild.id, commands));
        } catch (e) {
          this.logger?.error(e);
        }
      }
    }

    // Wait for all registration promises to complete
    await Promise.all(promises);
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
    const rest = new REST({ version: "10" }).setToken(this.token);

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

      this.logger?.success(
        `Successfully unregistered ${commandNamesToRemove.length} command(s) for guild with ID: ${guildId}.`
      );
    } catch (e) {
      this.logger?.error(
        `Failed to unregister guild commands for ${guildId}: ${e}`
      );
    }
  }

  async unRegisterGlobalCommands(commands: SlashCommandBuilder[]) {
    const rest = new REST({ version: "10" }).setToken(this.token);

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

      this.logger?.success(
        `Successfully unregistered ${commandNamesToRemove.length} command(s)`
      );
    } catch (e) {
      this.logger?.error(`Failed to unregister global commands: ${e}`);
    }
  }
}
