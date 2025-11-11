import {
  addDays,
  addMilliseconds,
  getDay,
  parse,
  set,
  isAfter
} from 'date-fns';
import { InvalidTimeFormatError, TaskNotSetError } from './errors.js';

/**
 * Day of the week. 0 = Sunday, 1 = Mondy, ..., 6 = Saturday
 */
export enum Weekday {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

type Task = () => void | Promise<void>;

interface ScheduleRules {
  interval: number | null; // in milliseconds
  atTime: Date | null; // Stores HH:MM:SS as a Date object
  daysOfWeek: Set<Weekday>;
}

export class Job {
  private rules: ScheduleRules;
  public task: Task | null;
  public nextRun: Date;
  private buildError: Error | null;

  constructor() {
    this.rules = {
      interval: null,
      atTime: null,
      daysOfWeek: new Set()
    };
    this.task = null;
    this.nextRun = new Date();
    this.buildError = null;
  }

  /**
   * Schedules the job to run at a fixed interval.
   * Incompatible with `.at()` and day-based scheduling.
   * @param interval - The interval in milliseconds. Use `seconds()`, `minutes()`, `hours()`. 
   */
  public every(interval: number): this {
    if (this.buildError) return this;
    this.rules.interval = interval;
    this.rules.atTime = null;
    this.rules.daysOfWeek.clear();
    return this;
  }

  /**
   * Schedules the job to run at a specific time of day.
   * @param timeStr - A string "HH:MM" or "HH:MM:SS".
   */
  public at(timeStr: string): this {
    if (this.buildError) return this;

    let parsedTime: Date;
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      parsedTime = parse(timeStr, 'HH:mm', new Date());
    } else if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
      parsedTime = parse(timeStr, 'HH:mm:ss', new Date());
    } else {
      this.buildError = new InvalidTimeFormatError(timeStr);
      return this;
    }

    this.rules.atTime = parsedTime;
    this.rules.interval = null;
    return this;
  }

  /**
   * Adds a specific day of the week for the job to run.
   * @param day - The `Weekday` enum value (0-6).
   */
  public on(day: Weekday): this {
    this.rules.daysOfWeek.add(day);
    return this;
  }

  /**
   * Helper to schedule a job for all weekdays (Mon-Fri).
   */
  public onWeekday(): this {
    return this.on(Weekday.Monday)
      .on(Weekday.Tuesday)
      .on(Weekday.Wednesday)
      .on(Weekday.Thursday)
      .on(Weekday.Friday);
  }

  /**
   * Helper to schedule a job for the weekend (Sat-Sun).
   */
  public onWeekend(): this {
    return this.on(Weekday.Saturday).on(Weekday.Sunday);
  }

  /**
   * Sets the task to be executed and finalizes the job.
   * @param task - The function to execute. Can be async.
   */
  public run(task: Task): this {
    if (this.buildError) return this;
    this.task = task;
    this.nextRun = this.calculateNextRun(new Date());
    return this;
  }

  /**
   * Internal: Checks for configuration errors.
   */
  public checkForErrors(): void {
    if (this.buildError) {
      throw this.buildError;
    }
    if (!this.task) {
      throw new TaskNotSetError();
    }
  }

  /**
   * Internal: Calculates the next execution time.
   */
  public calculateNextRun(from: Date): Date {
    // Case 1: Interval-based job
    if (this.rules.interval) {
      return addMilliseconds(from, this.rules.interval);
    }

    // Case 2: Specific-time job
    if (this.rules.atTime) {
      let nextRun = set(from, {
        hours: this.rules.atTime.getHours(),
        minutes: this.rules.atTime.getMinutes(),
        seconds: this.rules.atTime.getSeconds(),
        milliseconds: 0
      });

      // If time is already past today, schedule for tomorrow
      if (isAfter(from, nextRun)) {
        nextRun = addDays(nextRun, 1);
      }

      // If specific days are set, find the next valid day
      if (this.rules.daysOfWeek.size > 0) {
        while (!this.rules.daysOfWeek.has(getDay(nextRun) as Weekday)) {
          nextRun = addDays(nextRun, 1);
        }
      }
      return nextRun;
    }

    // Default: Job is misconfigured (no interval or time), run 1 year from now.
    // This case is avoided by the `TaskNotSetError` check, but serves as a fallback.
    return addDays(from, 365);
  }
}