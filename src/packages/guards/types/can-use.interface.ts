import { Interaction, Message } from "discord.js";

export interface CanUse {
  canUse(
    context: any,
    ...args: unknown[]
  ): boolean | Promise<boolean> | unknown;
}
