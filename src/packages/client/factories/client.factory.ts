import { IDiscordClientOptions } from "../types/client.types";
import { DiscordClient } from "../client";
import { ModuleDiscordCollector } from "../collectors/module.collector";
import { EventHandler, handlers, InteractionHandler } from "../handlers";
import { Events } from "discord.js";

export class DiscordFactory {
  /**
   * 1) creating instance
   * 2) collect modules
   * 3) add handlers
   * 4) return client instance
   */
  public static async create(options: IDiscordClientOptions) {
    const client = new DiscordClient({ ...options });
    const collector = new ModuleDiscordCollector(client);
    /**
     * Collecting entities (e.g. slash_commands or events)
     */
    await collector.collect();
    /**
     * Connecting handlers
     */
    handlers.map(handler => {
      new handler(client).connect()
    })
    return client;
  }
}
