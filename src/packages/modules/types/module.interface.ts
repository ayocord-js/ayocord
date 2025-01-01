export interface DiscordModule {
  onLoad?: () => any | Promise<any>;
  onDisable?: () => any | Promise<any>;
}
