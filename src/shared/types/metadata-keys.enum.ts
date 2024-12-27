/**
 * Metadata keys for interact with decorators
 */
export enum MetadataKeys {
  /**
   * Container module
   */
  MODULE = "module",

  /**
   * Interaction module
   */
  EVENT = "event",
  SLASH_COMMAND = "slashcommands",
  COMPONENT = "component",
  TEXT_COMMAND = "textcommands",
  AUTO_COMPLETE = "autocomplete",
  SUB_COMMAND = "subcommand",

  /**
   * View module
   */
  View = "view",
  Button = "button",
  StringSelect = "select",
  RoleSelect = "roleselect",
  ChannelSelect = "channelselect",
  UserSelect = "channelselect",
  Modal = "modal",
}
