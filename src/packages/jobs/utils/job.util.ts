import { Job } from "node-schedule";

export type TJobKey = string;

/**
 * Utility class for managing scheduled jobs.
 */
export class JobUtils {
  /**
   * Cache to store jobs mapped by their keys.
   * The job can be either a `setInterval` instance or a `node-schedule` Job.
   */
  static cache: Map<TJobKey, NodeJS.Timeout | Job> = new Map();

  /**
   * Retrieves a job from the cache using its key or the function name.
   *
   * @param id - The key or function used to identify the job.
   * @returns The job object or `undefined` if no job is found.
   */
  static get(id: TJobKey | Function): NodeJS.Timeout | Job | undefined {
    return this.cache.get(this.getId(id));
  }

  /**
   * Creates or stores a job in the cache.
   *
   * @param id - The key or function used to identify the job.
   * @param job - The job instance to be stored.
   */
  static create(id: TJobKey | Function, job: Job | NodeJS.Timeout): void {
    this.cache.set(this.getId(id), job);
  }

  /**
   * Deletes a job from the cache and stops its execution.
   * Cancels the job if it is a `node-schedule` Job or clears the interval for `setInterval`.
   *
   * @param id - The key or function used to identify the job.
   */
  static delete(id: TJobKey | Function): void {
    const job = this.cache.get(this.getId(id));
    if (job) {
      if (typeof job === "object" && "cancel" in job) {
        job.cancel(); // Stop a node-schedule job
      } else {
        clearInterval(job as NodeJS.Timeout); // Clear an interval
      }
      this.cache.delete(this.getId(id));
    }
  }

  /**
   * Gets a unique identifier from a key or function.
   *
   * @param id - The key or function to generate an identifier for.
   * @returns A string identifier.
   */
  private static getId(id: TJobKey | Function): string {
    return typeof id === "function" ? id.name : id;
  }
}
