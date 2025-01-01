import { DiscordClient } from "@/packages/client";

export interface DiscordModule {
  onEnable?: (client?: DiscordClient) => any | Promise<any>;
  onDisable?: (client?: DiscordClient) => any | Promise<any>;
}
