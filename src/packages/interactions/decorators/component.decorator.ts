import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { ModuleMetadataKeys } from "../../../shared/types/metadata-keys.enum";
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
 * Supports method-level usage, with argument parsing.
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
 */
export const Component = (options: IComponentOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Method decorator logic
    const originalMethod = descriptor.value;
    Reflect.defineMetadata(
      ModuleMetadataKeys.COMPONENT,
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
  };
};
