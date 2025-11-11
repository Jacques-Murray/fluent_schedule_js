import { Job, Weekday } from './job.js';
import { seconds, minutes } from './timeUnits.js';
import { InvalidTimeFormatError, TaskNotSetError } from './errors.js';
import { set, addDays, getDay } from 'date-fns';

// Helper: 2025-11-10 @ 12:00:00 (Monday)
const fixedNow = () => new Date('2025-11-10T12:00:00.000Z');

describe('Job', () => {
  it('test_calc_interval', () => {
    const now = fixedNow();
    const job = new Job().every(minutes(5)).run(() => { });
    const next = job.calculateNextRun(now);
    expect(next.getTime()).toBe(now.getTime() + minutes(5));
  });

  it('test_calc_at_today_future', () => {
    const now = fixedNow(); // 12:00
    const job = new Job().at('14:00').run(() => { });
    const next = job.calculateNextRun(now);

    const expected = set(now, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 });
    expect(next).toEqual(expected);
  });

  it('test_calc_at_today_past', () => {
    const now = fixedNow(); // 12:00
    const job = new Job().at('10:00').run(() => { });
    const next = job.calculateNextRun(now);

    let expected = set(now, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });
    expected = addDays(expected, 1); // Should be tomorrow
    expect(next).toEqual(expected);
  });

  it('test_calc_at_on_other_day', () => {
    const now = fixedNow(); // Monday 12:00
    // Wednesday at 14:00
    const job = new Job().on(Weekday.Wednesday).at('14:00').run(() => { });
    const next = job.calculateNextRun(now);

    let expected = set(now, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 });
    expected = addDays(expected, 2); // 2 days from Mon -> Wed

    expect(next).toEqual(expected);
    expect(getDay(next)).toBe(Weekday.Wednesday);
  });

  it('test_job_check_for_errors', () => {
    const jobOk = new Job().every(seconds(1)).run(() => { });
    expect(() => jobOk.checkForErrors()).not.toThrow();

    const jobErrTime = new Job().at('bad-time').run(() => { });
    expect(() => jobErrTime.checkForErrors()).toThrow(InvalidTimeFormatError);

    const jobErrTask = new Job().every(seconds(1));
    expect(() => jobErrTask.checkForErrors()).toThrow(TaskNotSetError);
  });
});