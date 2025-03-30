import { DiscordModule } from "@/packages/modules";
import { DiscordClient } from "../client";
import { ModuleMetadataKeys } from "@/shared";
import { AutoDiscordCollector } from "./auto.collector";

export class ModuleDiscordCollector extends AutoDiscordCollector {
  constructor(client: DiscordClient) {
    super(client);
  }

  public async collect(modules: DiscordModule[] = []) {
    for (const module of modules) {
      if (this.isValidClass(module, ModuleMetadataKeys.MODULE)) {
        await this.processModule(module);
      }
    }
  }
}
