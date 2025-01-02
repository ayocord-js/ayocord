import { DiscordModule } from "@/packages/modules";
import { DiscordClient } from "../client";
import { BaseDiscordCollector } from "./base-module.collector";

export class ModuleDiscordCollector extends BaseDiscordCollector {
  constructor(client: DiscordClient) {
    super(client);
  }

  public async collect(modules: DiscordModule[] = []) {
    for (const module of modules) {
      if (this.isValidModule(module)) {
        await this.processModule(module);
      }
    }
  }
}
