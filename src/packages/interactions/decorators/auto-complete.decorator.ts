import { ModuleMetadataKeys } from "@/shared";

export interface IAutoCompleteOptions {
  /**
   * It needs for handling autocomplete for command
   */
  parentName: string;
  groupName?: string;
  subCommandName?: string;
}

export const AutoComplete = (options: IAutoCompleteOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      ModuleMetadataKeys.SUB_COMMAND,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};
