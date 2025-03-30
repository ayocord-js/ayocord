import { Events } from "discord.js";
import { ModuleMetadataKeys } from "../../../shared/types/metadata-keys.enum";

export interface IEventOptions {
  /**
   * The name of the event to handle.
   * Use the `Events` enum from `discord.js` for predefined event names.
   */
  name: Events | string;

  /**
   * Indicates whether the event handler should be executed only once.
   * Defaults to `false`.
   */
  once?: boolean;
}

/**
 * Decorator for handling Discord.js events.
 * Can be applied to classes or methods.
 *
 * @param options - Configuration options for the event.
 * @example
 * ```typescript
 * @Event({ name: Events.MessageCreate })
 * class MyEventHandler {
 *   handle(event: Message) {
 *     console.log(event.content);
 *   }
 * }
 * ```
 */
export const Event = (options: IEventOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Method decorator logic
    const originalMethod = descriptor.value;
    Reflect.defineMetadata(ModuleMetadataKeys.EVENT, options, target, propertyKey);
    descriptor.value = async function (...args: unknown[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (e) {
        console.error("Error in event method decorator:", e);
      }
    };
    return descriptor;
  };
};
