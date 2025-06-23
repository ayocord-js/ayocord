import { ViewMetadataKeys } from "@/shared";
import {
  IButtonOptions,
  IChannelSelectOptions,
  IRoleSelectOptions,
  IStringSelectOptions,
  IUserSelectOptions,
} from "../types";

export const Button = (options: IButtonOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.BUTTON,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};

export const StringSelect = (options: IStringSelectOptions) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.STRINGSELECT,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};

export const RoleSelect = (options: IRoleSelectOptions) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.ROLESELECT,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};

export const ChannelSelect = (options: IChannelSelectOptions) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.CHANNELSELECT,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};

export const UserSelect = (options: IUserSelectOptions) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      ViewMetadataKeys.USERSELECT,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};
