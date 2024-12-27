export interface DiscordModule {
  onLoad?: () => any | Promise<any>;
  onUnload?: () => any | Promise<any>;
}
