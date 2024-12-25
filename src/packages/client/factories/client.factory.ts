import { IDiscordClientOptions } from "../types/client.types";
import { DiscordClient } from "../client";
import { DiscordCollector } from "../collectors/client.collector";
import { EventHandler } from "../handlers";

export class DiscordFactory {
  /**
   * 1) creating instance
   * 2) collect modules
   * 3) add handlers
   * 4) return client instance
   */
  public static async create(options: IDiscordClientOptions) {
    const client = new DiscordClient({ ...options });
    const collector = new DiscordCollector(client);
    /**
     * Collecting entities (e.g. slash_commands or events)
     */
    await collector.collect()
    /**
     * Connecting handlers
     */
    await Promise.all([EventHandler.handle(client)]);
    return client;
  }
}
