import { DiscordClient, SlashCommandCollection } from "@/packages/client";
import { AyocordSlashCommandBuilder } from "@/packages/interactions";
import { SlashCommandBuilder, Snowflake } from "discord.js";

export type TGlobalCommands = AyocordSlashCommandBuilder[];
export type TGuildCommands = Record<
  Snowflake,
  { commands: AyocordSlashCommandBuilder[] }
>;

export interface ICommands {
  globalCommands: TGlobalCommands;
  guildCommands: TGuildCommands;
}

/** Utility for processing commands */
export class CommandUtility {
  /**
   * Retrieves commands grouped into global and guild-specific contexts.
   * @param client - The Discord client instance.
   * @param module - The module to process.
   * @returns An object containing global and guild-specific commands.
   */
  static async getCommands(
    client: DiscordClient,
    slashCommands: SlashCommandCollection,
  ): Promise<ICommands> {
    const globalCommands: TGlobalCommands = [];
    const guildCommands: TGuildCommands = {};

    await Promise.all(
      slashCommands.map(async (command) => {
        const { builder, synchronize } = command.options;
        const syncOptions = await CommandUtility.resolveSyncOptions(
          client,
          synchronize,
        );
        const { guilds, global } = syncOptions;

        if (global) {
          globalCommands.push(builder);
        }

        if (guilds?.length) {
          for (const guildId of guilds) {
            if (!guildCommands[guildId]) {
              guildCommands[guildId] = { commands: [] };
            }
            guildCommands[guildId].commands.push(builder);
          }
        }
      }),
    );

    return { globalCommands, guildCommands };
  }

  public static async synchronize(
    client: DiscordClient,
    commands: ICommands,
    register: boolean,
  ) {
    const promises: Promise<any>[] = [];
    const { globalCommands, guildCommands } = commands;

    if (client.synchronize?.global) {
      promises.push(
      register
        ? client.replaceGlobalCommands(globalCommands)
        : client.unRegisterGlobalCommands(globalCommands),
      );
    }

    if (client.synchronize?.guild) {
      for (const guildId in guildCommands) {
        const commands = guildCommands[guildId].commands;
        promises.push(
          register
            ? client.replaceGuildCommands(guildId, commands)
            : client.unRegisterGuildCommands(guildId, commands),
        );
      }
    }
    await Promise.allSettled(promises);
  }

  /**
   * Resolves synchronization options for a command.
   * @param client - The Discord client instance.
   * @param synchronize - Synchronization options or function.
   */
  private static async resolveSyncOptions(
    client: DiscordClient,
    synchronize?: any,
  ) {
    if (!synchronize) return { guilds: [], global: true };

    if (typeof synchronize.useAsync === "function") {
      return await synchronize.useAsync(client);
    }

    return synchronize.options;
  }
}
