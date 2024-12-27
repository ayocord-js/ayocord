import { MetadataKeys } from "@/shared";

export interface IAutoCompleteOptions {
  /**
   * It needs for handling autocomplete for command
   */
  parentName: string;
}

export const AutoComplete = (options: IAutoCompleteOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MetadataKeys.SUB_COMMAND, options, target);
    return descriptor;
  };
};
