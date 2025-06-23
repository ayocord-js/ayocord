import {
  channelMention,
  roleMention,
  Snowflake,
  userMention,
} from "discord.js";
import { SnowflakeMentionType } from "../types";

class SnowflakeParser {
  private static baseParser(
    regex: RegExp,
    content: string,
    fallbackToGeneric = false,
  ): string[] | string {
    const find = [...content.matchAll(regex)];
    return find.length <= 0 && !fallbackToGeneric
      ? this.baseParser(/(\d{17,19})/g, content, true)
      : find.map((match) => match[1]);
  }

  /**
   * Find all mentions in string. If "parseMentions" is enabled the function will return you mentions else snowflakes
   */
  static parseAll(options: { content: string; parseMentions: boolean }) {
    const regex = options.parseMentions
      ? /<(@|#|@&)(\d{17,19})>/g
      : /\b(\d{17,19})\b/g;
    const find = [...options.content.matchAll(regex)];
    return find.map((match) => match[2] || match[1]);
  }

  /**
   * Parse user mentions from content
   */
  static user(content: string) {
    return this.baseParser(/<@(\d{17,19})>/g, content);
  }

  /**
   * Parse role mentions from content
   */
  static role(content: string) {
    return this.baseParser(/<@&(\d{17,19})>/g, content);
  }

  /**
   * Parse channel mentions from content
   */
  static channel(content: string) {
    return this.baseParser(/<#(\d{17,19})>/g, content);
  }

  /**
   * Use "roleMention" or "channelMention" or "useMention" from discord.js instead
   */
  static mention(
    snowflake: Snowflake | null,
    type: SnowflakeMentionType,
  ): string | null {
    if (!snowflake) return null;
    switch (type) {
      case SnowflakeMentionType.ROLE:
        return roleMention(snowflake);
      case SnowflakeMentionType.CHANNEL:
        return channelMention(snowflake);
      case SnowflakeMentionType.USER:
        return userMention(snowflake);
    }
  }
}

export default SnowflakeParser;
