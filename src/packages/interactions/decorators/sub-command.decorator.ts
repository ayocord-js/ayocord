import { ModuleMetadataKeys } from "@/shared";

export interface ISubCommandOptions {
  /**
   * It needs for handling sub command
   */
  parentName: string;
  name: string;
  groupName?: string;
}

export const SubCommand = (options: ISubCommandOptions) => {
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
