import { DiscordClient } from "../client";
import { BaseDiscordCollector } from "./base-module.collector";

export class AutoDiscordCollector extends BaseDiscordCollector {
  constructor(client: DiscordClient) {
    super(client);
  }
}
