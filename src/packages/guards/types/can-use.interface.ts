import { Interaction, Message } from "discord.js";

export interface CanUse {
  canUse: (context: Message | Interaction) => boolean | Promise<boolean>;
}
