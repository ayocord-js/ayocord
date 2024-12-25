import { Events, Message } from "discord.js";
import { MetadataKeys } from "../../../../shared/types/metadata-keys.enum";

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
    descriptor.value = async function (...args: unknown[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (e) {
        console.error("Error in event decorator:", e);
      }
    };

    return descriptor;
  };
};
