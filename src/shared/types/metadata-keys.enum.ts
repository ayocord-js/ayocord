/**
 * Metadata keys for interact with decorators
 */
export enum ModuleMetadataKeys {
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
}

export enum ViewMetadataKeys {
  /**
   * VIEW MAIN
   */
  VIEW = "view",
  /**
   * For set methods
   */
  VIEW_COMPONENTS = "viewcomponents",

  VIEW_CLASS = "viewclass",
  /**
   * COMPONENTS
   */
  BUTTON = "button",
  STRINGSELECT = "select",
  ROLESELECT = "roleselect",
  CHANNELSELECT = "channelselect",
  USERSELECT = "channelselect",
  MODAL = "modal",
}
