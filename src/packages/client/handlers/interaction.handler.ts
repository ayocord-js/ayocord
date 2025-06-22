import {
  AnySelectMenuInteraction,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ButtonInteraction,
  CommandInteraction,
  Events,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscordClient } from "../client";
import { CustomIdParser } from "@/packages/utils/parsers/custom-id.parser";
import { IHandler } from "../types/handler.interface";
import { ISlashCommandEntity, IViewEntity } from "../types";
import { BaseHandler } from "./abstract.handler";

/**
 * Class responsible for handling interactions in Discord.
 * It processes commands, subcommands, components, and autocomplete interactions.
 */
export class InteractionHandler extends BaseHandler implements IHandler {
  /**
   * Creates an instance of the InteractionHandler class.
   * @param {DiscordClient} client - The Discord client instance to be used for event handling.
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Connects the handler to the Discord client and listens for interaction events.
   */
  public connect(): void {
    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      this.handle(interaction);
    });
  }

  /**
   * Handles various types of interactions, including commands, subcommands, components, and autocomplete.
   * @param {Interaction} interaction - The interaction to handle.
   */
  protected async handle(interaction: Interaction) {
    if (interaction.isCommand()) {
      this.handleCommands(interaction);
      this.handleSubCommand(interaction);
    }
    if (interaction.isAutocomplete()) {
      return await this.handleAutoCompolete(interaction);
    }
    if (
      interaction.isButton() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    ) {
      return await Promise.all([
        this.handleComponents(interaction),
        this.handleView(interaction),
      ])
    }
  }

  /**
   * Handles the execution of a slash command.
   * @param {CommandInteraction} interaction - The interaction to handle.
   */
  protected async handleCommands(interaction: CommandInteraction) {
    const commandFromCache = this.client.slashCommands.get(
      interaction.commandName
    );
    if (commandFromCache) {
      const { options, module } =
        commandFromCache as unknown as ISlashCommandEntity;
      if (!this.getModuleFromCache(commandFromCache)) return;
      if (
        (module.isDev || options.isDevOnly) &&
        !this.client.devs?.includes(interaction.user.id)
      )
        return;
      try {
        await commandFromCache.executor(interaction);
      } catch (e) {
        this.client.logger?.error(e);
      }
    }
  }

  /**
   * Handles the execution of a subcommand.
   * @param {CommandInteraction} interaction - The interaction to handle.
   */
  protected async handleSubCommand(interaction: CommandInteraction) {
    try {
      const commandName = interaction.commandName;

      const hasSubCommandGroup = interaction.options.data.some(
        (option) => option.type === ApplicationCommandOptionType.SubcommandGroup
      );
      const hasSubCommand = interaction.options.data.some(
        (option) => option.type === ApplicationCommandOptionType.Subcommand
      );

      const subCommandGroupName = hasSubCommandGroup
        ? (interaction.options as any)?.getSubcommandGroup()
        : "";
      const subCommandName = hasSubCommand
        ? (interaction.options as any)?.getSubcommand()
        : "";

      const subCommandFromCache = this.client.subCommands.get(
        this.getCommandName(commandName, subCommandGroupName, subCommandName)
      );

      if (!subCommandFromCache) {
        return;
      }

      try {
        await subCommandFromCache.executor(interaction);
      } catch (e) {
        this.client.logger?.error(e);
      }
    } catch (e) {
      this.client.logger?.error(e);
    }
  }

  private getCommandName(
    commandName: string,
    subCommandGroupName: string = "",
    subCommandName: string = ""
  ) {
    return `${commandName}${subCommandGroupName.length ? "_" + subCommandGroupName : ""
      }${subCommandName.length ? "+" + subCommandName : ""}`;
  }

  protected async handleView(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | AnySelectMenuInteraction
  ) {
    const args = CustomIdParser.parseArguments(interaction.customId);
    const componentFromCache = this.client.views.get(args[0]);
    if (!componentFromCache) return;
    const { options, module, executor } = componentFromCache;
    const { view, component } = options;
    const { isDevOnly, isAuthorOnly, ttl } = component;
    if (
      (view.isDev || module.isDev || isDevOnly) &&
      !this.client.devs?.includes(interaction.user.id)
    )
      return;
    if (isAuthorOnly && interaction.user.id !== interaction.message?.author.id)
      return;
    const createdAt = interaction.message?.createdTimestamp;
    if (createdAt && ttl && createdAt + ttl <= Date.now()) return;
    try {
      await executor(interaction, args.slice(0, -1));
    } catch (e) {
      this.client.logger?.error(e);
    }
  }

  /**
   * Handles interactions with components (e.g., buttons, select menus, modals).
   * @param {ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction} interaction - The interaction to handle.
   */
  protected async handleComponents(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | AnySelectMenuInteraction
  ) {
    const args = CustomIdParser.parseArguments(interaction.customId);

    const componentFromCache = this.client.components.get(args[0]);
    if (componentFromCache) {
      const { options, module } = componentFromCache;
      const { isDevOnly, isAuthorOnly, ttl } = options;
      if (!this.getModuleFromCache(componentFromCache)) return;
      if (
        (module.isDev || isDevOnly) &&
        !this.client.devs?.includes(interaction.user.id)
      )
        return;
      if (
        isAuthorOnly &&
        interaction.user.id !== interaction.message?.author.id
      )
        return;
      const createdAt = interaction.message?.createdTimestamp;
      if (createdAt && ttl && createdAt + ttl <= Date.now()) return;
      try {
        await componentFromCache.executor(interaction, args.slice(0, -1));
      } catch (e) {
        this.client.logger?.error(e);
      }
    }
  }

  /**
   * Handles autocomplete interactions for slash commands and subcommands.
   * @param {AutocompleteInteraction} interaction - The interaction to handle.
   */
  protected async handleAutoCompolete(interaction: AutocompleteInteraction) {
    try {
      const commandName = interaction.commandName;

      const hasSubCommandGroup = interaction.options.data.some(
        (option) => option.type === ApplicationCommandOptionType.SubcommandGroup
      );
      const hasSubCommand = interaction.options.data.some(
        (option) => option.type === ApplicationCommandOptionType.Subcommand
      );

      const subCommandGroupName = hasSubCommandGroup
        ? (interaction.options as any).getSubcommandGroup()
        : "";
      const subCommandName = hasSubCommand
        ? (interaction.options as any).getSubcommand()
        : "";

      const autoCompleteFromCache = this.client.autoComplete.get(
        this.getCommandName(commandName, subCommandGroupName, subCommandName)
      );

      if (!autoCompleteFromCache) {
        return;
      }

      try {
        await autoCompleteFromCache.executor(interaction);
      } catch (e) {
        this.client.logger?.error(e);
      }
    } catch (e) {
      this.client.logger?.error(e);
    }
  }
}
