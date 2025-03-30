import { glob } from "glob";
import path from "path";

export interface IDecoratorMetadataKeys {
  key: string; // The name of the method
  method: Function; // The actual method reference
}

export interface ICollector {
  collect(): void | Promise<void>;
}

export class BaseCollector {
  /**
   * Retrieves methods from a module class that are decorated with metadata.
   * @param module The module class to analyze.
   * @returns An array of methods and their associated metadata keys.
   */
  public static getModuleMethods(module: any): IDecoratorMetadataKeys[] {
    return Object.getOwnPropertyNames(module.prototype)
      .filter((key) => key !== "constructor")
      .map((key) => ({
        key,
        method: module.prototype[key],
      }));
  }

  protected async getAllProjectModules() {
    const extension = require.main?.filename.endsWith(".js") ? "js" : "ts";
    const modules: any[] = [];
    const files = await glob(`**/*.${extension}`, {
      ignore: ["**/node_modules/**"],
      cwd: process.cwd(),
    });
    await Promise.allSettled(
      files.map(async (file) => {
        const absolutePath = path.resolve(process.cwd(), file);
        try {
          const module = await import(absolutePath);
          modules.push(module);
        } catch {}
      })
    );
    return modules.map((module) => Object.values(module));
  }

  /**
   * Retrieves metadata associated with a specific key.
   * @param target The target object (class or method).
   * @param key The metadata key to retrieve.
   * @returns The metadata value or null if not found.
   */
  protected getMetadata<T>(
    target: Object,
    metadataKey: string,
    propertyKey?: string | symbol
  ): T | null {

    if (propertyKey !== undefined) {
      return Reflect.getMetadata(metadataKey, target, propertyKey) || null;
    }

    return Reflect.getMetadata(metadataKey, target) || null;
  }
  protected isValidClass(target: any, metadataKey: string) {
    try {
      const isValid = Reflect.hasMetadata(metadataKey, target);
      return isValid;
    } catch {
      return false;
    }
  }
}
