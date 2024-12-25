import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CommandInteraction,
  Events,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscordClient } from "../client";
import { CustomIdParser } from "@/packages/utils/parsers/custom-id.parser";
import { IHandler } from "../types/handler.interface";
import { ISlashCommandOptions } from "@/packages/interactions";

export class InteractionHandler implements IHandler {
  client: DiscordClient;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  connect(): void {
    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      this.handle(interaction);
    });
  }
  protected async handle(interaction: Interaction) {
    if (interaction.isCommand()) {
      return await this.handleCommands(interaction);
    }
    if (
      interaction.isButton() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    ) {
      return await this.handleComponents(interaction);
    }
  }

  protected async handleCommands(interaction: CommandInteraction) {
    const commandFromCache = this.client.slashCommands.get(
      interaction.commandName
    );

    if (commandFromCache) {
      const { isDevOnly } = commandFromCache as unknown as ISlashCommandOptions;
      if (isDevOnly && !this.client.devs?.includes(interaction.user.id)) return;
      await commandFromCache.executor(interaction);
    }
  }
  protected async handleComponents(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | AnySelectMenuInteraction
  ) {
    const args = CustomIdParser.parseArguments(interaction.customId);

    const componentFromCache = this.client.components.get(args[0]);
    if (componentFromCache) {
      const { isDevOnly, isAuthorOnly, ttl } = componentFromCache?.options;
      if (isDevOnly && !this.client.devs?.includes(interaction.user.id)) return;
      if (
        isAuthorOnly &&
        interaction.user.id !== interaction.message?.author.id
      )
        return;
      const createdAt = interaction.message?.createdTimestamp;
      if (createdAt && ttl && createdAt + ttl <= Date.now()) return;
      await componentFromCache.executor(interaction, args.slice(0, -1));
    }
  }
  protected async handleAutoCompolete() {}
}
