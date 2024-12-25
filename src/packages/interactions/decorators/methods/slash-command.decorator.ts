import { MetadataKeys } from "@/shared";
import { SlashCommandBuilder, Snowflake } from "discord.js";

export interface ISlashCommandSynchronizeOptions {
  global: boolean;
  /**
   * If you public bot you can use it for set synchronized commands for guild
   */
  guilds: Snowflake[];
}

export interface ISlashCommandOptions {
  synchronize?: {
    useAsync?: () =>
      | Promise<ISlashCommandSynchronizeOptions>
      | ISlashCommandSynchronizeOptions;
    options?: ISlashCommandSynchronizeOptions;
  };
  builder: SlashCommandBuilder;
  isDevOnly?: boolean;
}

export const SlashCommand = (options: ISlashCommandOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      MetadataKeys.SLASH_COMMAND,
      options,
      target,
      propertyKey
    );
    return descriptor;
  };
};
