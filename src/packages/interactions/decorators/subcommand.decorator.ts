import { MetadataKeys } from "@/shared";

export interface ISubCommandOptions {
  /**
   * It needs for handling sub command
   */
  parentName: string;
}

export const SubCommand = (options: ISubCommandOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      MetadataKeys.SUB_COMMAND,
      target,
      options,
      propertyKey
    );
    return descriptor;
  };
};
