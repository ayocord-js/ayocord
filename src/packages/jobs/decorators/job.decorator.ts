import { scheduleJob, Job as ScheduleJob } from "node-schedule";
import { JobUtils } from "../utils";

/**
 * Interface for defining time intervals.
 *
 * Used to configure periodic job execution.
 */
export interface IJobIntervalOptions {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Interface for defining cron-based schedules.
 *
 * Note: Do not use `cronString` and `date` together.
 * `cronString` takes precedence over `date`.
 */
export interface IJobScheduleOptions {
  cronString?: string;
  date?: Date;
}

/**
 * Combined interface for job configuration.
 *
 * Note: Do not use both `interval` and `cron` together.
 * `cron` takes precedence over `interval`.
 */
export interface IJob {
  interval?: IJobIntervalOptions;
  cron?: IJobScheduleOptions;
}

/**
 * Options for configuring the `Job` decorator.
 */
export interface IJobOptions {
  options?: IJob;
  /**
   * Provides dynamic configuration for the job.
   *
   * Note: `useAsync` takes precedence over `options`.
   * Avoid using `options` and `useAsync` together.
   * @returns A promise resolving to the job configuration.
   */
  useAsync?: () => Promise<IJob> | IJob;
}

/**
 * Decorator to schedule a method as a periodic or cron-based job.
 *
 * @example
 * ```typescript
 * class Foo {
 *   @Job({
 *     options: {
 *       interval: {
 *         seconds: 30,
 *       },
 *     },
 *   })
 *   logMessage() {
 *     console.log("This message is logged every 30 seconds.");
 *   }
 * }
 * ```
 *
 * @param options - Configuration for the job.
 */
export const Job = (options: IJobOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: unknown[]) => {
      const { options: jobOptions, useAsync } = options;
      const resolvedOptions = (useAsync ? await useAsync() : jobOptions) as
        | IJob
        | undefined;

      if (!resolvedOptions) return;

      const { cron, interval } = resolvedOptions;

      if (cron && interval) {
        throw new Error("Cannot use both 'cron' and 'interval' options.");
      }

      let job: NodeJS.Timeout | ScheduleJob | null = null;

      if (cron) {
        const { date, cronString } = cron;
        if (date || cronString) {
          job = scheduleJob(cronString ?? date!, () => {
            void originalMethod.apply(target, args);
          });
        }
      }

      if (interval) {
        const { days, hours, minutes, seconds } = interval;
        const intervalTime =
          ((days || 0) * 24 * 3600 +
            (hours || 0) * 3600 +
            (minutes || 0) * 60 +
            (seconds || 0)) *
          1_000;

        if (intervalTime > 0) {
          job = setInterval(() => {
            void originalMethod.apply(target, args);
          }, intervalTime);
        }
      }

      if (job) {
        JobUtils.create(propertyKey, job);
      }
    };

    return descriptor;
  };
};
