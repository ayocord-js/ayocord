import { DiscordClient } from "../client";
import { IHandler } from "../types/handler.interface";
import { BaseHandler } from "./abstract.handler";

export class TextCommandHandler extends BaseHandler implements IHandler {
  constructor(client: DiscordClient) {
    super(client);
  }
  connect(): void {}
}
