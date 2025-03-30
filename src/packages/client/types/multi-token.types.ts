import { IDiscordClientOptions } from "@/packages";

export interface IMultiTokenBot {
  options: IDiscordClientOptions;
  /**
   * Array of Discord Module clases
   *
   * Which use @Module decorator
   */
  modules?: any[];
}

export interface IMultiTokenOptions {
  /**
   * Here we recomend you define your default options which will inherit in other bots
   */
  defaultBotOptions?: IMultiTokenBot;
  bots: Record<string, IMultiTokenBot>;
}
