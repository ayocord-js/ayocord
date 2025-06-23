import { DiscordClient } from "../client";
import { TEntity } from "../types";

export class BaseHandler {
  protected client: DiscordClient;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  protected getModuleFromCache(entity: TEntity): boolean {
    const { module } = entity;
    return !!this.client.modules.get(module.name)?.isEnabled;
  }
}
