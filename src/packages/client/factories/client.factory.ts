import { IDiscordClientOptions } from "../types/client.types";
import { DiscordClient } from "../client";
import { AutoDiscordCollector, ModuleDiscordCollector } from "../collectors";
import { IMultiTokenOptions } from "../types";
import { DiscordModule } from "@/packages/modules";
import { MultiTokenBotsUitility } from "../utils";

/**
 * A factory for creating and configuring a Discord client.
 */
export class DiscordFactory {
  /**
   * This method connect all handlers for client
   */
  private static connectHandlers(client: DiscordClient) {
    const { interaction, event, textCommand } = client.handlers;
    const handlers = [interaction, textCommand, event];
    handlers.forEach((Handler: any) => {
      new Handler(client).connect();
    });
  }

  private static connectCollector(
    client: DiscordClient,
    modules: DiscordModule[] = []
  ) {
    const { collector } = client;
    if (collector?.modules?.length || modules.length) {
      return new ModuleDiscordCollector(client).collect(
        modules.length ? modules : collector?.modules || []
      );
    }
    if (collector?.auto) {
      return new AutoDiscordCollector(client).collect();
    }
  }

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
  public static create(options: IDiscordClientOptions) {
    // Create a new instance of DiscordClient
    const client = new DiscordClient({ ...options });

    // Connect collector
    try {
      this.connectCollector(client);
    } catch (e) {
      client.logger?.error(e);
    }

    // Connect handlers
    try {
      this.connectHandlers(client);
    } catch (e) {
      client.logger?.error(e);
    }
    return client;
  }

  public static createMultiToken(options: IMultiTokenOptions) {
    const clients: DiscordClient[] = [];
    const { bots, DEFAULT } = options;
    Object.keys(bots).forEach((key) => {
      const bot = bots[key];
      const { options, modules: botModules } = bot;
      const client = new DiscordClient({
        ...(DEFAULT?.options || { intents: [] }),
        ...options,
      });
      const modules: DiscordModule[] = [
        ...(DEFAULT?.modules || []),
        ...(botModules || []),
      ];
      try {
        this.connectCollector(client, modules);
      } catch (e) {
        client.logger?.error(
          `Error while connecting collector for bot: ${key}`
        );
      }
      try {
        this.connectHandlers(client);
      } catch (e) {
        client.logger?.error(`Error while connecting handler for bot: ${key}`);
      }
      // Set bot to cache
      MultiTokenBotsUitility.set(key.toLowerCase(), client);
      clients.push(client);
    });
    return clients;
  }
}
