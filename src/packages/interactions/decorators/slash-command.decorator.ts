import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  Snowflake,
} from "discord.js";
import { ModuleMetadataKeys } from "@/shared";
import { DiscordClient } from "@/packages/client";

/**
 * I really don't how to typize this... :(
 */
export type AyocordSlashCommandBuilder = any;

export interface ISlashCommandSynchronizeOptions {
  /**
   * Determines whether the command is global.
   * If `true`, the command will be registered globally.
   */
  global: boolean;

  /**
   * Specifies the guild IDs where the command should be registered.
   * Only applicable if `global` is `false`.
   */
  guilds: Snowflake[];
}

export interface ISlashCommandOptions {
  /**
   * Configuration options for command synchronization.
   */
  synchronize?: {
    /**
     * A function to provide synchronization options asynchronously.
     */
    useAsync?: (
      client?: DiscordClient,
    ) =>
      | Promise<ISlashCommandSynchronizeOptions>
      | ISlashCommandSynchronizeOptions;

    /**
     * Predefined synchronization options.
     */
    options?: ISlashCommandSynchronizeOptions;
  };

  /**
   * The builder used to define the slash command.
   */
  builder: AyocordSlashCommandBuilder;

  /**
   * Indicates whether the command is restricted to developers only.
   */
  isDevOnly?: boolean;
}

/**
 * Decorator for defining slash commands.
 * Can be applied to classes or methods.
 *
 * @param options - Configuration options for the slash command.
 * @example
 * ```typescript
 * @SlashCommand({
 *   builder: new SlashCommandBuilder().setName("ping").setDescription("Ping command"),
 *   isDevOnly: false,
 * })
 * class PingCommand {
 *   execute(interaction: CommandInteraction) {
 *     interaction.reply("Pong!");
 *   }
 * }
 * ```
 */
export const SlashCommand = (options: ISlashCommandOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Method decorator logic
    Reflect.defineMetadata(
      ModuleMetadataKeys.SLASH_COMMAND,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};
