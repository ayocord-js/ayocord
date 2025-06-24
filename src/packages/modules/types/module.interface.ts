import { DiscordClient } from "@/packages/client";

export interface DiscordModule {
  onInit?: (client?: DiscordClient) => any | Promise<any>
  onEnable?: (client?: DiscordClient) => any | Promise<any>;
  onDisable?: (client?: DiscordClient) => any | Promise<any>;
}
