import { ModuleMetadataKeys } from "@/shared";

/**
 * Enum representing the types of arguments that can be fetched from a command.
 */
export enum ITextCommandArgumentType {
  USER = 0,
  ROLE = 1,
  CHANNEL = 2,
  STRING = 3,
  NUMBER = 4,
  TEXT = 5,
}

export interface ITextCommandArgument {
  /**
   * The name of the argument.
   */
  name: string;

  /**
   * Specifies the possible types for this argument.
   * The first matching type determines the value passed to the command.
   */
  types: ITextCommandArgumentType[];

  /**
   * Indicates whether this argument is required.
   */
  isRequired?: boolean;
}

export interface ITextCommandOptions {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * An optional description of the command.
   */
  description?: string;

  /**
   * Defines the arguments that the command accepts.
   */
  args?: ITextCommandArgument[];
}

/**
 * Decorator for defining text commands.
 * Can be applied to classes or methods.
 *
 * @param options - Configuration options for the text command.
 * @example
 * ```typescript
 * @TextCommand({
 *   name: "hello",
 *   description: "Says hello",
 *   args: [{ name: "name", types: [ITextCommandArgumentType.STRING], isRequired: true }],
 * })
 * class HelloCommand {
 *   execute(msg: Message, args: any[]) {
 *     msg.reply(`Hello, ${args[0]}!`);
 *   }
 * }
 * ```
 */
export const TextCommand = (options: ITextCommandOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Method decorator logic
    Reflect.defineMetadata(
      ModuleMetadataKeys.TEXT_COMMAND,
      options,
      target,
      propertyKey,
    );
    return descriptor;
  };
};
