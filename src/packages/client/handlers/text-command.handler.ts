import { Message } from "discord.js";
import { DiscordClient } from "../client";
import { IHandler } from "../types/handler.interface";
import { BaseHandler } from "./abstract.handler";
import { ITextCommandArgumentType } from "@/packages/interactions";

/**
 * Handler for processing text commands.
 *
 * This handler listens for messages, parses commands and their arguments,
 * and executes the corresponding command logic if all conditions are met.
 */
export class TextCommandHandler extends BaseHandler implements IHandler {
  /**
   * Initializes the text command handler.
   *
   * @param client - The Discord client instance.
   */
  constructor(client: DiscordClient) {
    super(client);
  }

  /**
   * Connects the handler to the `messageCreate` event of the Discord client.
   */
  connect(): void {
    this.client.on("messageCreate", (msg) => this.handle(msg));
  }

  /**
   * Handles an incoming message, parses it as a command, and executes the relevant logic.
   *
   * @param msg - The message object from the `messageCreate` event.
   */
  private async handle(msg: Message) {
    const prefix = this.client.prefix;
    const command = msg.content;

    // Split message content into arguments
    const messageArgs = command.split(" ");

    /**
     * Check if a prefix is defined.
     * Logs a warning and exits if the prefix is not set.
     */
    if (!prefix) {
      return;
    }

    /**
     * Check if the message content is valid.
     * Logs a warning and exits if the content is empty.
     */
    if (!command) {
      return;
    }

    const commandName = messageArgs[0];
    if (!commandName.startsWith(prefix)) return;

    /**
     * Retrieve the command configuration from the cache using its name.
     */
    const commandFromCache = this.client.textCommands.get(
      commandName.replace(prefix, "").toLowerCase()
    );

    /**
     * Log a warning if the command is not found in the cache.
     */
    if (!commandFromCache) {
      return;
    }

    const { module, options } = commandFromCache;

    /**
     * Verify if the module associated with the command is enabled.
     * Logs a warning and exits if the module is disabled.
     */
    if (!this.getModuleFromCache(commandFromCache)) {
      return;
    }

    const { args } = options;

    /**
     * If the command has no arguments, execute it directly.
     */
    if (!args || args.length === 0) {
      await commandFromCache.executor(msg, []);
      return;
    }

    /**
     * Parsed arguments for the command.
     */
    const parsedArgs = [];
    let currentIndex = 1; // Start after the command name

    /**
     * Iterate through the command's expected arguments and parse each one.
     */
    for (const arg of args) {
      const { types, name, isRequired } = arg;

      /**
       * If there are no more arguments in the message, handle required arguments.
       */
      if (currentIndex >= messageArgs.length) {
        if (isRequired) {
          return;
        }
        break;
      }

      const rawValue = messageArgs[currentIndex];
      let value = null;

      /**
       * Check the argument against each specified type until a match is found.
       */
      for (const type of types) {
        switch (type) {
          case ITextCommandArgumentType.USER:
            value = msg.mentions.users.get(rawValue.replace(/[<@!>]/g, ""));
            break;
          case ITextCommandArgumentType.ROLE:
            value = msg.mentions.roles.get(rawValue.replace(/[<@&>]/g, ""));
            break;
          case ITextCommandArgumentType.CHANNEL:
            value = msg.mentions.channels.get(rawValue.replace(/[<#>]/g, ""));
            break;
          case ITextCommandArgumentType.STRING:
            value = rawValue;
            break;
          case ITextCommandArgumentType.NUMBER:
            value = !isNaN(Number(rawValue)) ? Number(rawValue) : null;
            break;
          case ITextCommandArgumentType.TEXT:
            value = messageArgs.slice(currentIndex).join(" ");
            currentIndex = messageArgs.length; // End parsing for TEXT
            break;
        }

        if (!value) break; // Stop checking types if a match is found
      }

      /**
       * Handle invalid or missing required arguments.
       */
      if (!value && isRequired) {
        return;
      }

      parsedArgs.push(value);
      currentIndex++; // Move to the next argument
    }

    /**
     * Execute the command with the parsed arguments.
     *
     * @example
     * ```typescript
     * commandFromCache.executor(msg, parsedArgs);
     * ```
     */
    await commandFromCache.executor(msg, parsedArgs);
  }
}
