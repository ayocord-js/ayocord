import { DiscordClient } from "../client";

export class EventHandler {
  static async handle(client: DiscordClient) {
    const events = client.options.events!;
    events.map((event) => {
      const { options, executor } = event;
      if (options.once) {
        client.once(options.name, (...args: unknown[]) => executor(...args));
      } else {
        client.on(options.name, (...args: unknown[]) => executor(...args));
      }
    });
  }
}
