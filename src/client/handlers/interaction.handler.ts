import { DiscordClient } from "../client";

export class InteractionHandler {
  async handle(client: DiscordClient) {}

  protected async handleCommands() {}
  protected async handleComponents() {}
  protected async handleAutoCompolete() {}
}
