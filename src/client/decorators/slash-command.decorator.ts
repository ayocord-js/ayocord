import { SlashCommandBuilder } from "discord.js";

export interface ISlashCommandOptions {
  builder: SlashCommandBuilder;
  isDevOnly?: boolean;
}

export const SlashCommand = (options: ISlashCommandOptions) => {
  return () => {};
};
