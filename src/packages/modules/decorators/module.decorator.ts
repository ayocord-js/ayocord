import { ModuleMetadataKeys } from "@/shared/types/metadata-keys.enum";


// Интерфейс для параметров, передаваемых в декоратор
export interface IModuleOptions {
  name: string;
  isDev?: boolean;
}

/**
 * Class decorator
 *
 * THIS IS NOT DI
 */
export const Module = (options: IModuleOptions) => {
  return (target: Function) => {
    /**
     * Save class metadata
     */
    Reflect.defineMetadata(ModuleMetadataKeys.MODULE, options, target);
  };
};
