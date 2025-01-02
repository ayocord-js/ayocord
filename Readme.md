<div align="center">
  <a href="https://www.ayocord.tech/">
    <img src="https://imgur.com/mCLyhj2.png">
  </a>
</div>

# Introduction

Ayocord is a discord.js typescript framework based on decorators

## Documenation

Check our <a href="https://www.ayocord.tech/docs/">documentation</a>

## Installation

> npm

```bash
npm i ayocord
```

> yarn

```bash
yarn add ayocord
```

## Little bit history?

I always write handlers for my bots and it was really boring and sometimes hard <br>
For each commands you **must** create files <br>
In python discord libraries we're using decorators for solving this problem <br>
One class = one module (cog in python sleng), however I hate python and love TypeScript ecosystem but this way for creating discord bots I like and I decided to create this framework <br>

## Features

- **Decorator Based Syntax** - use TypeScript decorators and class based way to write your discord bot
  - Interactions - use decorators to interact with discord API in one class
    - Event
    - Slash commands
    - Text commands
    - Autocomplete
  - **Views** - using for create your rows with callback!
    - Button
    - Select (Role, Channel, User, String)
    - Modal
  - **Guards** - check permissions before user use your command
    - Guard
  - **Jobs** - you need to check use subcribes every 20 seconds? This decorators can solve your problem
    - Job
- **Utils** - some useful utils for your discord bot (not rich and not poor)
  - Snowflake parser
  - Discohook parser
  - CustomId parser
- **Multi tokens** - allow you launch few bots simultaneously

## Realesed Features

### Launcher

> Internal feature

- [x] DiscordClient
- [x] DiscordCollector
- [x] DiscordFactory

### Handlers

> Internal feature

- [x] EventHandler
- [x] InteractionHandler
- [x] TextCommandHandler

### Interaction Decorators

> Use this decorators for interact with discord API <br>
> There are two ways to use this decorators

**Recommended**

- Methods

  - [x] Event
  - [x] Component
  - [x] SlashCommand
  - [x] TextCommand
  - [x] AutoComplete
  - [x] SubCommand

### Views

> Use this decorators to creating action rows with callback

- [ ] Views
- [ ] Button
- [ ] Modal
- [ ] StringSelect
- [ ] RoleSelect
- [ ] ChannelSelect

### Guards

> Use this decorator for checking permissions or another stuff before user interact with command or something else

- Decorators
  - [x] Guard
- Interfaces
  - [x] CanUse

### Job

> Use this decorator to repeat action every duration

- Decorators
  - [ ] Job
- Cache
  - [ ] Set jobs
  - [ ] Cancel jobs

### Modules

- Decorators
  - [x] Module
- Lifecycle
  - [x] onEnabled
  - [x] onDisable
- Module util
  - [x] moduleEnable
  - [x] moduleDisable
