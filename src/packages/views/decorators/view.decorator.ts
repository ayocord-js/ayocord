import { MetadataKeys } from "@/shared";

export interface IViewOptions {
  name: string;
  /**
   * If true interact with view can only do developers
   */
  isDev?: boolean;
  /**
   * If true interact with view can only do author
   */
  isAuthorOnly?: boolean;
}

/**
 * All views pushed to components
 * CustomId there must be unique anyway
 */
export const View = (options: IViewOptions) => {
  return <T extends { new (...args: any[]): {} }>(BaseClass: T) => {
    return class extends BaseClass {
      constructor(...args: any[]) {
        super(...args);
        Reflect.defineMetadata(MetadataKeys.View, options, BaseClass);
        return;
      }
    };
  };
};
