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
  /**
   * If not null the componet will exist only ttl time. P.s. miliseconds
   */
  ttl?: number;
}

/**
 * This an universal decorator allow handle any component
 */
export const Component = (options: IComponentOptions) => {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {};
};
