import { Interaction, Message } from "discord.js";
import { CanUse } from "../types";

export const Guard = (...guards: (new () => CanUse)[]) => {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      context: Message | Interaction,
      ...args: unknown[]
    ) {
      for (const GuardClass of guards) {
        const guardInstance = new GuardClass();
        const isAllowed = await guardInstance.canUse(context);
        if (!isAllowed) {
          return;
        }
      }
      return originalMethod.apply(this, [context, ...args]);
    };

    return descriptor;
  };
};
