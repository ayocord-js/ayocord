import { IDiscordClientOptions } from "../types/client.types";
import { DiscordClient } from "../client";
import { ModuleDiscordCollector } from "../collectors/module.collector";
import { handlers } from "../handlers";

/**
 * A factory for creating and configuring a Discord client.
 */
export class DiscordFactory {
  /**
   * Creates a Discord client instance, collects modules, connects handlers, and synchronizes commands.
   * 
   * @param options - The options for initializing the Discord client.
   * @returns A fully configured instance of `DiscordClient`.
   * 
   * @example
   * const client = await DiscordFactory.create({
   *   token: "your-bot-token",
   *   synchronize: { global: true, guild: true },
   * });
   */
  public static async create(options: IDiscordClientOptions) {
    // Create a new instance of DiscordClient
    const client = new DiscordClient({ ...options });

    // Create an instance of the module collector
    const collector = new ModuleDiscordCollector(client);

    try {
      // Collect modules such as slash commands or event listeners
      await collector.collect();
      client.logger?.info("Modules have been successfully collected.");
    } catch (e) {
      client.logger?.error(`Error while collecting modules: ${e}`);
    }

    // Connect handlers (e.g., events, interactions)
    handlers.forEach((Handler) => {
      new Handler(client).connect();
      client.logger?.success(`Handler ${Handler.name} connected successfully.`);
    });

    return client;
  }
}
