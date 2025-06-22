import { IDiscordClientOptions } from "@/packages";
import { DiscordClient } from "../client";
import { AutoDiscordCollector, ModuleDiscordCollector } from "@/packages";
import { IMultiTokenOptions } from "../types";
import { DiscordModule } from "@/packages/modules";
import { MultiTokenBotsUitility } from "../utils";
import { ViewDiscordCollector } from "../collectors/view.collector";

/**
 * A factory for creating and configuring a Discord client.
 */
export class DiscordFactory {
  /**
   * This method connect all handlers for client
   */
  private static connectHandlers(client: DiscordClient) {
    const { interaction, event, textCommand } = client.handlers!;
    const handlers = [interaction, textCommand, event];
    handlers.forEach((Handler: any) => {
      new Handler(client).connect();
    });
  }

  private static async connectModuleCollector(
    client: DiscordClient,
    modules: DiscordModule[] = []
  ) {
    const { collector } = client;
    const modules_ = modules.length ? modules : collector?.modules || [];
    if (collector?.auto) {
      return await new AutoDiscordCollector(client).collect();
    }
    if (collector?.modules?.length || modules.length) {
      return await new ModuleDiscordCollector(client).collect(modules_);
    }
  }

  private static async connectViewCollector(client: DiscordClient) {
    return await new ViewDiscordCollector(client).collect();
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
  public static async create(options: IDiscordClientOptions) {
    // Create a new instance of DiscordClient
    const client = new DiscordClient({ ...options });
    if (!client.enabled) {
      if (client.type === "singletoken") {
        throw new Error("Main client is disabled!!");
      }
      return;
    }
    // Connect collector
    try {
      await this.connectCollectors(client, []);
    } catch (e) {
      client.logger?.error(e);
    }
    return client;
  }

  private static async connectCollectors(
    client: DiscordClient,
    modules: DiscordModule[]
  ) {
    try {
      await this.connectModuleCollector(client, modules);
    } catch (e) {
      client.logger?.error(`Error while connecting module collector`);
    }
    try {
      await this.connectViewCollector(client);
    } catch {
      client.logger?.error(`Error while connecting view collector`);
    }
    try {
      this.connectHandlers(client);
    } catch (e) {
      client.logger?.error(`Error while connecting handler`);
    }
  }

  public static async createMultiToken(options: IMultiTokenOptions) {
    const clients: DiscordClient[] = [];
    const { bots, defaultBotOptions } = options;
    for (const key of Object.keys(bots)) {
      const bot = bots[key];
      const { options, modules: botModules } = bot;
      if (!options.enabled) continue
      const intents = [
        // @ts-ignore
        ...(defaultBotOptions?.options.intents || []),
        ...(options.intents || []),
      ];
      const client = new DiscordClient({
        ...defaultBotOptions?.options,
        ...options,
        type: "multitoken",
        intents,
      });
      const modules: DiscordModule[] = [
        ...(defaultBotOptions?.modules || []),
        ...(botModules || []),
      ];
      try {
        await this.connectCollectors(client, modules);
      } catch (e) {
        client.logger?.error(e);
      }
      // Set bot to cache
      MultiTokenBotsUitility.set(key.toLowerCase(), client);
      clients.push(client);
    }
    return clients;
  }

  public static async createFromInstance(client: DiscordClient) {
    await this.connectCollectors(client, []);
    return client;
  }
}
