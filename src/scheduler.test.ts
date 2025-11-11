import { Scheduler } from './scheduler.js';
import { Job } from './job.js';
import { seconds } from './timeUnits.js';
import { TaskNotSetError } from './errors.js';

describe('Scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('test_scheduler_add_valid_job', () => {
    const scheduler = new Scheduler();
    const job = new Job().every(seconds(1)).run(() => { });
    expect(() => scheduler.add(job)).not.toThrow();
  });

  it('test_scheduler_add_job_no_task', () => {
    const scheduler = new Scheduler();
    const job = new Job().every(seconds(1));
    expect(() => scheduler.add(job)).toThrow(TaskNotSetError);
  });

  it('test_scheduler_integration_run_job', () => {
    const scheduler = new Scheduler();
    const mockTask = jest.fn();

    const job = new Job().every(seconds(1)).run(mockTask);
    scheduler.add(job);

    // Start the scheduler
    scheduler.run();

    // No calls immediately
    expect(mockTask).not.toHaveBeenCalled();

    // Advance time by 1.5 seconds
    jest.advanceTimersByTime(1500);
    expect(mockTask).toHaveBeenCalledTimes(1);

    // Advance time by another 1 second
    jest.advanceTimersByTime(1000);
    expect(mockTask).toHaveBeenCalledTimes(2);

    scheduler.stop();
  });
});