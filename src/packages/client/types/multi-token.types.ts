import { DiscordModule } from "@/packages/modules";
import { IDiscordClientOptions } from "./client.types";

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
  DEFAULT?: IMultiTokenBot;
  bots: Record<string, IMultiTokenBot>;
}
