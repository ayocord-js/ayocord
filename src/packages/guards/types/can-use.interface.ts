export interface CanUse {
  canUse(
    context: any,
    ...args: unknown[]
  ): boolean | Promise<boolean> | unknown;
}
