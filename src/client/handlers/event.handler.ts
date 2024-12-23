import { DiscordClient } from "../client";

export class EventHandler {
  static async handle(client: DiscordClient) {
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
