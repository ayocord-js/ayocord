// TODO: implement it

export interface IComponentOptions {
  customId: string;
  /**
   * If enabled this component can be used only by author
   */
  isAuthorOnly?: boolean;
  /**
   * If enabled this component be used olly by devs from `IDiscordClientOptions`
   */
  isDevOnly?: boolean;
}

/**
 * This an universal decorator allow handle any component
 */
export const Component = (options: IComponentOptions) => {
  return () => {};
};
