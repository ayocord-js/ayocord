import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscordClient } from "../client";
import { CustomIdParser } from "@/packages/utils/parsers/custom-id.parser";

export class InteractionHandler {
  async handle(interaction: Interaction) {
    if (
      interaction.isButton() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    ) {
      return await this.handleComponents(interaction);
    }
  }

  protected async handleCommands() {}
  protected async handleComponents(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | AnySelectMenuInteraction
  ) {
    const args = CustomIdParser.parseArguments(interaction.customId);
    const componentFromCache = (
      interaction.client as DiscordClient
    ).components.get(args[0]);
    if (componentFromCache) {
      await componentFromCache.executor(interaction, args.slice(0, -1));
    }
  }
  protected async handleAutoCompolete() {}
}
