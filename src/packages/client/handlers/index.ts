import { EventHandler } from "./event.handler";
import { InteractionHandler } from "./interaction.handler";
import { TextCommandHandler } from "./text-command.handler";

export * from "./event.handler";
export * from "./interaction.handler";
export * from "./text-command.handler";
export * from './abstract.handler'

export const handlers = [InteractionHandler, EventHandler, TextCommandHandler];
