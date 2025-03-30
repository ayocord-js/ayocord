import { IComponentOptions } from "@/packages/interactions";
import {
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

export enum RowPosition {
  First = 0,
  Second = 1,
  Third = 2,
  Fouth = 3,
  Fifth = 4,
}

export interface IBaseViewComponent<T>
  extends Omit<IComponentOptions, "customId"> {
  builder: T;
  /**
   * The position of your component
   */
  row: RowPosition;
}

export interface IButtonOptions extends IBaseViewComponent<ButtonBuilder> {}
export interface IRoleSelectOptions
  extends IBaseViewComponent<RoleSelectMenuBuilder> {}
export interface IChannelSelectOptions
  extends IBaseViewComponent<ChannelSelectMenuBuilder> {}
export interface IStringSelectOptions
  extends IBaseViewComponent<StringSelectMenuBuilder> {}
export interface IUserSelectOptions
  extends IBaseViewComponent<UserSelectMenuBuilder> {}
