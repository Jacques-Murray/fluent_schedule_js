import { Job } from './job.js';

const MAX_SLEEP_MS = 60 * 1000; // 1 minute

export class Scheduler {
  private jobs: Job[] = [];
  private timer: NodeJS.Timeout | null = null;
  private running: boolean = false;

  /**
   * Creates a new, empty Scheduler.
   */
  constructor() { }

  /**
   * Adds a configured Job to the scheduler.
   * Throws an error if the job has an invalid configuration.
   */
  public add(job: Job): void {
    job.checkForErrors();
    this.jobs.push(job);
  }

  /**
   * Starts the scheduler.
   * This is a non-blocking operation.
   */
  public run(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.tick();
  }

  /**
   * Stops the scheduler from running any more jobs.
   */
  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.running = false;
  }

  private tick = (): void => {
    if (!this.running) {
      return;
    }

    if (this.jobs.length === 0) {
      this.running = false;
      return;
    }

    const now = new Date();
    let nextSleepDuration = MAX_SLEEP_MS;

    for (const job of this.jobs) {
      // Check if job is due
      if (now >= job.nextRun) {
        try {
          // Run the task (async or sync)
          Promise.resolve(job.task!()).catch((err) => {
            console.error('Error executing job:', err);
          });
        } catch (err) {
          console.error('Error executing job:', err);
        }
        // Reschedule for the next run
        job.nextRun = job.calculateNextRun(now);
      }

      // Calculate time until this job's next run
      const waitMilliseconds = job.nextRun.getTime() - now.getTime();

      // Find the shortest wait time for the next loop
      if (waitMilliseconds > 0 && waitMilliseconds < nextSleepDuration) {
        nextSleepDuration = waitMilliseconds;
      }
    }

    // Schedule the next tick
    this.timer = setTimeout(this.tick, nextSleepDuration);
  };
}