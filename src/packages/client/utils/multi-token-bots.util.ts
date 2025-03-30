import { DiscordClient } from "../client";

export class MultiTokenBotsUitility {
  /**
   * The names of loggined bots
   */
  public static bots: Map<string, DiscordClient> = new Map();

  static getAll() {
    return this.bots;
  }

  static get(name: string) {
    return this.bots.get(name);
  }

  static set(name: string, client: DiscordClient) {
    return this.bots.set(name, client);
  }

  static delete(name: string) {
    return this.bots.delete(name);
  }
}
