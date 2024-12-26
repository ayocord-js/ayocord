import { Message } from "discord.js";
import { DiscordClient } from "../client";
import { IHandler } from "../types/handler.interface";
import { BaseHandler } from "./abstract.handler";

export class TextCommandHandler extends BaseHandler implements IHandler {
  constructor(client: DiscordClient) {
    super(client);
  }
  connect(): void {
    this.client.on("messageCreate", (msg) => this.handle(msg));
  }

  private async handle(msg: Message) {
    const prefix = this.client.prefix;
    const command = msg.content;
    /**
     * Split message content to arguments
     */
    const messageArgs = command.split(" ");
    /**
     * Check prefix
     */
    if (!prefix) {
      this.client.logger?.warn("You're not assign prefix in client options");
      return;
    }
    /**
     * Check message content intent
     */
    if (!command) {
      this.client.logger?.warn(
        "Intent GuildMessage or MessageContent no connected"
      );
      return;
    }
    const commandName = messageArgs[0];
    if (!commandName.startsWith(prefix)) return;
    const commandFromCache = this.client.textCommands.get(
      commandName.replace(prefix, "")
    );
    if (!commandFromCache) {
      this.client.logger?.warn(`Command with name ${commandName} not found`);
      return;
    }
    const { module, options } = commandFromCache;
    /**
     * Check module enabling
     */
    if (!this.getModuleFromCache(commandFromCache)) {
      this.client.logger?.warn(
        `Module ${module.name} is not enabled. Command ${commandName} cannot be executed`
      );
      return;
    }
    const { args } = options;
    const parsedArgs = args?.map((arg) => {
      const { types, name } = arg;
      
    });
  }
}
