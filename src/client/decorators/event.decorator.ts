import { Events } from "discord.js";

export interface IEventOptions {
  /**
   * We recommend use enum Events from discord.js
   * `import { Events } from "discord.js";`
   */
  name: Events | string;
  once?: boolean;
}

/**
 * Decorator for handling all events
 */
export const Event = (options: IEventOptions) => {
  return () => {};
};
