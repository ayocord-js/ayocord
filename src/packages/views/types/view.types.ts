import { IComponentOptions } from "@/packages/interactions";
import {
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

export interface IViewComponentOptions<T> {
  useAsync: () => T | Promise<T>;
  options: T;
}

export interface IBaseViewComponent<T>
  extends Omit<IComponentOptions, "customId"> {
  builder: T;
}

export interface IButtonOptions extends IBaseViewComponent<ButtonBuilder> {}
export interface IRoleSelectOptions
  extends IBaseViewComponent<RoleSelectMenuBuilder> {}
export interface IChannelSelectOptions
  extends IBaseViewComponent<ChannelSelectMenuBuilder> {}
export interface IStringSelectOptions
  extends IBaseViewComponent<StringSelectMenuBuilder> {}
export interface IUserSelectOptions
  extends IViewComponentOptions<UserSelectMenuBuilder> {}
