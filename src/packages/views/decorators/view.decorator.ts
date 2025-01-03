import { IModule } from "@/packages/client";
import { BaseCollector } from "@/packages/client/collectors/base.collector";
import { ViewDiscordCollector } from "@/packages/client/collectors/view.collector";
import { ViewMetadataKeys } from "@/shared";
import { ActionRowBuilder, Base } from "discord.js";

export interface IViewOptions {
  /**
   * Instance of your module
   *
   * Is required option
   *
   * Needs for handling your components in view as basic component and have opportunity to enable/disable components using module!
   */
  module: Function;
  /**
   * If true interact with view can only do developers
   */
  isDev?: boolean;
  /**
   * If true interact with view can only do author
   */
  isAuthorOnly?: boolean;
  /**
   * When rows will not available
   */
  ttl?: number;
}

export interface IViewComponentMetadata {
  customId: string;
  executor: Function;
}

export interface IViewConstructorResponse {
  rows: ActionRowBuilder[];
}

/**
 * All views pushed to components
 * CustomId there must be unique anyway
 */
export const View = (options: IViewOptions) => {
  return <T extends { new (...args: any[]): {} }>(BaseClass: T) => {
    Reflect.defineMetadata(ViewMetadataKeys.VIEW, options, BaseClass);
    Reflect.defineMetadata(
      ViewMetadataKeys.VIEW_COMPONENTS,
      BaseCollector.getModuleMethods(BaseClass),
      BaseClass
    );
    Reflect.defineMetadata(ViewMetadataKeys.VIEW_CLASS, BaseClass, BaseClass);
    return class extends BaseClass {
      rows: ActionRowBuilder[];
      constructor(...args: any[]) {
        super(...args);
        this.rows = ViewDiscordCollector.collectRows(BaseClass);
      }
    };
  };
};
