import { DiscordClient } from "../client";
import { IHandler } from "../types/handler.interface";
import { BaseHandler } from "./abstract.handler";

export class EventHandler extends BaseHandler implements IHandler {
  constructor(client: DiscordClient) {
    super(client);
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
            return await executor(...args, module);
          });
        } else {
          client.on(options.name, async (...args: unknown[]) => {
            return await executor(...args, module);
          });
        }
      } catch (e) {
        return e;
      }
    });
  }
}
