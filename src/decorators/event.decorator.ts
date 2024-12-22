import { Events } from "discord.js";

/**
 * Decorator for handling all events
 */
export const Event = (name: Events, once = false) => {
  return () => {};
};
