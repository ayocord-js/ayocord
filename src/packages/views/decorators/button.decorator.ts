import { MetadataKeys } from "@/shared";
import { ButtonBuilder } from "discord.js";

export interface IButtonOptions {
  builder: ButtonBuilder;
  isDev?: boolean;
  isAuthor?: boolean;
}

export const Button = (options: IButtonOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MetadataKeys.Button, options, target, propertyKey);
    return descriptor;
  };
};
