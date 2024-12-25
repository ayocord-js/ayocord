import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { MetadataKeys } from "../../../../shared/types/metadata-keys.enum";
import { CustomIdParser } from "@/packages/utils/parsers/custom-id.parser";

export interface IComponentOptions {
  customId: string;
  /**
   * If enabled this component can be used only by author
   */
  isAuthorOnly?: boolean;
  /**
   * If enabled this component be used olly by devs from `IDiscordClientOptions`
   */
  isDevOnly?: boolean;
  /**
   * If not null the componet will exist only ttl time. P.s. miliseconds
   */
  ttl?: number;
}

/**
 * This an universal decorator allow handle any component
 */
export type TComponentInteraction =
  | AnySelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;
export const Component = (options: IComponentOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    Reflect.defineMetadata(
      MetadataKeys.COMPONENT,
      options,
      target,
      propertyKey
    );
    descriptor.value = async (interaction: TComponentInteraction) => {
      try {
        const args = CustomIdParser.parseArguments(interaction.customId);
        const result = await originalMethod.apply(this, [interaction, args]);
        return result;
      } catch (e) {
        // console.error(`Eror in component decorator: ${e}`);
      }
    };
    return descriptor;
  };
};
