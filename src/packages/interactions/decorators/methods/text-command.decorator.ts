import { MetadataKeys } from "@/shared";

/**
 * Enum representing the types of arguments that can be fetched from a command.
 */
export enum ITextCommandArgumentType {
  /**
   * Fetches user mentions from the command's content.
   */
  USER = 0,
  /**
   * Fetches role mentions from the command's content.
   */
  ROLE = 1,
  /**
   * Fetches channel mentions from the command's content.
   */
  CHANNEL = 2,
  /**
   * Fetches plain strings from the command's content.
   */
  STRING = 3,
  /**
   * Fetches numbers from the command's content.
   */
  NUMBER = 4,
  /**
   * Fetches a continuous block of text (similar to `STRING` but does not stop at the first delimiter).
   */
  TEXT = 5,
}

/**
 * Represents the configuration of a single argument in a text command.
 */
export interface ITextCommandArgument {
  /**
   * Using for argument object
   */
  name: string;

  /**
   * Specifies the possible types for this argument.
   *
   * The decorator evaluates each type in the order provided in the `types` array.
   * The first type that matches the argument's value will be used, and its value will be passed.
   *
   * Example:
   * ```ts
   * types: [ITextCommandArgumentType.USER, ITextCommandArgumentType.STRING]
   * // If the argument is a user mention or a string ID, its value will be used.
   * // The first matching type determines the value passed to the command.
   * ```
   */
  types: ITextCommandArgumentType[];

  /**
   * Indicates whether this argument is required.
   *
   * If set to `true` and the argument is not provided, the command will not execute.
   * Defaults to `false` if not specified.
   */
  isRequired?: boolean;
}

/**
 * Represents the configuration options for a text command.
 */
export interface ITextCommandOptions {
  /**
   * The name of the command.
   *
   * This is the primary identifier used to trigger the command.
   */
  name: string;

  /**
   * An optional description of the command.
   *
   * This property is intended for documentation and developer clarity.
   * It does not affect the command's behavior.
   */
  description?: string;

  /**
   * Defines the arguments that the command accepts.
   *
   * Each argument is configured using the `ITextCommandArgument` interface,
   * allowing you to specify types, required status, and other properties.
   */
  args?: ITextCommandArgument[];
}

export const TextCommand = (options: ITextCommandOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      MetadataKeys.TEXT_COMMAND,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};
