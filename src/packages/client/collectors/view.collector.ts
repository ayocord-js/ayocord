import { IViewOptions } from "@/packages/views";
import { BaseCollector, ICollector } from "./base.collector";
import { ViewMetadataKeys } from "@/shared";
import { IBaseViewComponent } from "@/packages/views/types";
import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { DiscordClient } from "../client";

export class ViewDiscordCollector extends BaseCollector implements ICollector {
  client: DiscordClient;
  constructor(client: DiscordClient) {
    super();
    this.client = client;
  }

  /**
   * Using in View decorator for collecting all decorator functions and transform them to rows
   */
  public static collectRows(view: any) {
    const methods = BaseCollector.getModuleMethods(view);
    const rows = [];
    for (const method of methods) {
      for (const key of Object.values(ViewMetadataKeys)) {
        const methodMetadata = Reflect.getMetadata(
          key,
          view.prototype,
          method.key
        ) as IBaseViewComponent<ButtonBuilder>;
        if (!methodMetadata) continue
        const { row: position, builder } = methodMetadata;
        if (key === ViewMetadataKeys.BUTTON) {
          const row = new ActionRowBuilder().addComponents(builder);
          const existed = rows[position];
          if (existed && existed.row.components.length + 1 <= 5) {
            existed.row.addComponents(builder);
          }
          rows.push({ row, position });
        } else {
          const row = new ActionRowBuilder().addComponents(builder);
          rows.push({ row, position });
        }
      }
    }
    return rows
      .sort((a, b) => a.position + b.position)
      .map((row) => row.row)
      .slice(0, 5);
  }

  public async collect(): Promise<void> {
    const fileModules = await this.getAllProjectModules();
    await Promise.allSettled(
      fileModules.map((module) => {
        module.map((value) => {
          const isValid = this.isValidClass(value, ViewMetadataKeys.VIEW);
          if (isValid) {
            this.processView(value);
          }
        });
      })
    );
  }

  private async processView(module: any) {
    const metadata = this.getMetadata<IViewOptions>(
      module,
      ViewMetadataKeys.VIEW
    );
    if (!metadata) return;

    const baseClass = Reflect.getMetadata(ViewMetadataKeys.VIEW_CLASS, module);
    const methods = BaseCollector.getModuleMethods(baseClass);
    for (const method of methods) {
      for (const key of Object.values(ViewMetadataKeys)) {
        if (
          (
            [
              ViewMetadataKeys.VIEW,
              ViewMetadataKeys.VIEW_COMPONENTS,
              ViewMetadataKeys.VIEW_CLASS,
            ] as string[]
          ).includes(key)
        )
          continue;
        const methodMetadata = Reflect.getMetadata(
          key,
          baseClass.prototype,
          method.key
        );
        if (!methodMetadata) continue;
        const component = methodMetadata;
        const customId = (component.builder?.toJSON() as any)?.custom_id;
        const boundMethod = method.method.bind(module);
        this.client.views.set(customId, {
          options: {
            view: metadata,
            component: methodMetadata as any,
          },
          module: metadata.module,
          executor: boundMethod,
        });
      }
    }
  }
}
