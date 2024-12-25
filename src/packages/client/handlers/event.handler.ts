import { DiscordClient } from "../client";
import { IHandler } from "../types/handler.interface";

export class EventHandler implements IHandler {
  client: DiscordClient;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  public connect(): void {
    this.handle(this.client);
  }
  private async handle(client: DiscordClient) {
    const events = client.events;
    events.map((event) => {
      try {
        const { options, executor } = event;
        if (options.once) {
          client.once(options.name, async (...args: unknown[]) => {
            return await executor(...args);
          });
        } else {
          client.on(options.name, async (...args: unknown[]) => {
            return await executor(...args);
          });
        }
      } catch (e) {
        return e;
      }
    });
  }
}
