import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { MetadataKeys } from "../../../shared/types/metadata-keys.enum";
import { CustomIdParser } from "@/packages/utils/parsers/custom-id.parser";
import { DiscordClient } from "@/packages/client";

export interface IComponentOptions {
  customId: string;
  /**
   * If enabled, this component can be used only by the author of the interaction.
   */
  isAuthorOnly?: boolean;
  /**
   * If enabled, this component can be used only by developers listed in `IDiscordClientOptions`.
   */
  isDevOnly?: boolean;
  /**
   * If not null, the component will exist only for `ttl` milliseconds.
   */
  ttl?: number;
}

/**
 * Type representing all supported component interactions.
 */
export type TComponentInteraction =
  | AnySelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;

/**
 * Universal decorator for handling any Discord.js component.
 * Supports both class-level and method-level usage, with argument parsing.
 *
 * @param options - Configuration options for the component.
 * @example
 * **Method Usage:**
 * ```typescript
 * class MyComponentHandler {
 *   @Component({ customId: "my-button", isAuthorOnly: true })
 *   async handleButton(interaction: ButtonInteraction, args: any) {
 *     await interaction.reply(`Button clicked with args: ${JSON.stringify(args)}`);
 *   }
 * }
 * ```
 *
 * **Class Usage:**
 * ```typescript
 * @Component({ customId: "my-menu" })
 * class MyMenuHandler {
 *   async execute(interaction: AnySelectMenuInteraction, args: any) {
 *     await interaction.reply(`Menu selected with args: ${JSON.stringify(args)}`);
 *   }
 * }
 * ```
 */
export const Component = (options: IComponentOptions) => {
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor
  ) => {
    if (propertyKey && descriptor) {
      // Method decorator logic
      const originalMethod = descriptor.value;
      Reflect.defineMetadata(
        MetadataKeys.COMPONENT,
        options,
        target,
        propertyKey
      );
      descriptor.value = async function (interaction: TComponentInteraction) {
        try {
          const args = CustomIdParser.parseArguments(interaction.customId);
          const result = await originalMethod.apply(this, [interaction, args]);
          return result;
        } catch (e) {
          (interaction.client as DiscordClient).logger?.error(
            `Error in Component method decorator: ${e}`
          );
        }
      };
      return descriptor;
    } else {
      // Class decorator logic
      Reflect.defineMetadata(MetadataKeys.COMPONENT, options, target.prototype);

      return class extends target {
        constructor(...args: any[]) {
          super(...args);
        }

        /**
         * Automatically executes the interaction and passes arguments parsed from the customId.
         */
        async execute(interaction: TComponentInteraction) {
          try {
            const args = CustomIdParser.parseArguments(interaction.customId);
            if (typeof super.execute === "function") {
              await super.execute(interaction, args);
            } else {
              (interaction.client as DiscordClient).logger?.warn(
                `No execute method found in class: ${this.constructor.name}`
              );
            }
          } catch (e) {
            (interaction.client as DiscordClient).logger?.error(
              `Error in Component class decorator: ${e}`
            );
          }
        }
      };
    }
  };
};
