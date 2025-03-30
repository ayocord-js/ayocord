import { config, DotenvParseOutput } from "dotenv";

export class ConfigUtility {
  private config: DotenvParseOutput | null = null;

  constructor() {
    const { error, parsed } = config();
    if (error) {
      console.error(error);
    }
    if (parsed) {
      this.config = parsed;
    }
  }

  get(key: string, _default?: any): string | null {
    if (!this.config) return null;
    const res = this.config[key];
    if (!res && !_default) {
      console.error(`Key ${key} does not exists`);
      return null;
    }
    return res ? res : _default;
  }
}
