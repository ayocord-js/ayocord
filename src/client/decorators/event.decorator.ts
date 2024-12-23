import { Events, Message } from "discord.js";
import { MetadataKeys } from "../types/metadata-keys.enum";

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
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    Reflect.defineMetadata(MetadataKeys.EVENT, options, target, propertyKey);
    descriptor.value = async (...args: unknown[]) => {
      const result = await originalMethod.apply(this, ...args);
      return result;
    };
    return descriptor;
  };
};
