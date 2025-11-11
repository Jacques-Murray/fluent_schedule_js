export class SchedulerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SchedulerError';
  }
}

export class InvalidTimeFormatError extends SchedulerError {
  constructor(time: string) {
    super(`Invalid time format: '${time}'. Expected 'HH:MM' or 'HH:MM:SS'.`);
    this.name = 'InvalidTimeFormatError';
  }
}

export class TaskNotSetError extends SchedulerError {
  constructor() {
    super('Job was not given a task to run. Call .run() to set a task.');
    this.name = 'TaskNotSetError';
  }
}