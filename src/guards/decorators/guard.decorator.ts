import { Interaction, Message } from "discord.js";
import { CanUse } from "../types";

export const Guard = (...guards: CanUse[]) => {
  return async (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async (
      context: Message | Interaction,
      ...args: unknown[]
    ) => {
      const checker = await Promise.all(
        guards.map(async (guard) => await guard.canUse(context))
      );
      checker.includes(false)
        ? null
        : originalMethod.apply(this, context, ...args);
    };
    return descriptor;
  };
};
