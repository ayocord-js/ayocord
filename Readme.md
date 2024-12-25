# AyoCord

Wow! This library is my new lvl of coding
Okey, What about she? This library is a wrapper under discord.js

## Why I created this library?

I always write handlers for my bots and it was really boring and sometimes hard
Also for Each command you must create many files

## Check this screen:

<img src="https://i.imgur.com/GAMOvjH.png">

You can see a lot of commands/components/events file

My library solve this problem

## Features

- TypeSafe
- Discord Entity decorators (class and method ways)
- Modules
- Views

## ToDo

### Launcher

- DiscordClient ✅
- DiscordCollector ❌
- DiscordFactory ✅

### Handlers

- EventHandler ✅
- InteractionHandler ❌
- TextCommandHandler ❌

### Interaction Decorators

> Methods

- Event ✅
- SlashCommand ✅
- TextCommand ❌
- Component ✅
- AutoComplete ❌

> Class

- Event ❌
- SlashCommand ❌
- TextCommand ❌
- Component ❌
- AutoComplete ❌

### Views

- Button ❌
- Modal ❌
- StringSelect ❌
- RoleSelect ❌
- ChannelSelect ❌

### Guards

- Guard ✅

## Examples

### Get started

```ts
import { DiscordFactory } from "@/client";
import { Client, GatewayIntentBits } from "discord.js";

/**
 * We define func bootstrap because method "create" in DiscordFactory is async and will return promise and you cannot use .login method
 */

async function bootstrap() {
  const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ];
  /**
   * Create client using DiscordFactory
   */
  const client = await DiscordFactory.create({
    intents: intents,
  });

  /**
   * Put your token here
   * Keep your token in .env file! It's really important!
   */
  client.login("TOKEN");
}

bootstrap();
```

### Event Decoator usage

```ts
import { AbstractModule, Event, DiscordClient } from "ayocord";
import { Events, Message } from "discord.js";

/**
 * We recommend you use the camelCase interpetation for event method names
 */

export class MyModule extends AbstractModule {
  constructor() {
    super({
      isDev: false,
    });
  }
  /**
   * Decorator for client ready event
   */
  @Event({ name: Events.ClientReady, once: false })
  /**
   * The standart event arguments from https://deno.land/x/discordx@5.8.1/docs/docs/general/events.md?source=
   */
  async clientReady(client: DiscordClient) {
    console.log(`${client.user.username} is started!`);
  }

  @Event({ name: Events.MessageCreate, once: false })
  async messageCreate(msg: Message) {
    console.log(msg.id);
    if (msg.content === "!ping") {
      return msg.reply({ content: "pong from decorators" });
    }
  }
}
```
