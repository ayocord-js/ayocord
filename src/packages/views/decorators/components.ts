import { ViewMetadataKeys } from "@/shared";
import {
  IButtonOptions,
  IChannelSelectOptions,
  IRoleSelectOptions,
  IStringSelectOptions,
  IUserSelectOptions,
  IViewComponentOptions,
} from "../types";

export const Button = (options: IViewComponentOptions<IButtonOptions>) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.BUTTON,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};

export const StringSelect = (
  options: IViewComponentOptions<IStringSelectOptions>
) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.STRINGSELECT,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};

export const RoleSelect = (
  options: IViewComponentOptions<IRoleSelectOptions>
) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.ROLESELECT,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};

export const ChannelSelect = (
  options: IViewComponentOptions<IChannelSelectOptions>
) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.CHANNELSELECT,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};

export const UserSelect = (
  options: IViewComponentOptions<IUserSelectOptions>
) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.USERSELECT,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};
