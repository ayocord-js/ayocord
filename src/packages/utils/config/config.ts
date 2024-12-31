import { config, DotenvParseOutput } from "dotenv";

export class ConfigUtility {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error(`File .env not found`);
    }
    if (!parsed) {
      throw new Error(`File .env is empty`);
    }
    this.config = parsed;
  }

  get(key: string, _default?: any): string | never {
    const res = this.config[key];
    if (!res && !_default) {
      throw new Error(`This key does not exists`);
    }
    return res ? res : _default;
  }
}
