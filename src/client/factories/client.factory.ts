import { IDiscordClientOptions } from "../types/client.types";
import { DiscordClient } from "../client";
import { DiscordCollector } from "../collectors/client.collector";

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
    await collector.collect();
    return client;
  }
}
