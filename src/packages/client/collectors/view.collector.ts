import { IViewConstructorResponse, IViewOptions } from "@/packages/views";
import { BaseCollector, ICollector } from "./base.collector";
import { ViewMetadataKeys } from "@/shared";

export class ViewDiscordCollector extends BaseCollector implements ICollector {
  constructor() {
    super();
  }

  /**
   * Using in View decorator for collecting all decorator functions and transform them to rows
   */
  public static collectRows() {}

  public async collect(): Promise<void> {
    const modules = await this.getAllProjectModules();
    await Promise.allSettled(
      modules.map((module) => {
        if (this.isValidClass(module, ViewMetadataKeys.VIEW)) {
          this.processView(module);
        }
      })
    );
  }

  private async processView(module: any) {
    const metadata = this.getMetadata<IViewOptions>(module, ViewMetadataKeys.VIEW);
    const methods = this.getModuleMethods(module)
    for (const method of methods) {
      for (const key in ViewMetadataKeys) {
        if (key === "VIEW") continue
        const methodMetadata = this.getMetadata(module, key, method.key)
        if (!methodMetadata) continue
        
      }
    }
  }
}
