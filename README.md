# Fluent Schedule

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/fluent-schedule.svg)](https://www.npmjs.com/package/fluent-schedule)

A human-readable, fluent task scheduling library for Node.js and TypeScript. This library provides a simple API for scheduling tasks without using complex cron syntax.

## Features

- **Fluent API**: Chain methods to build schedules in a readable way
- **Flexible Scheduling**: Support for intervals, specific times, and day-of-week scheduling
- **Type Safety**: TypeScript support with full type definitions
- **Error Handling**: Clear error messages for invalid configurations
- **Async Support**: Jobs can be synchronous or asynchronous functions
- **Non-blocking**: Scheduler runs in the background without blocking the event loop
- **Zero Dependencies**: Only depends on `date-fns` for time handling

## Installation

Add this to your project:

```bash
npm install fluent-schedule
```

Or with yarn:

```bash
yarn add fluent-schedule
```

## Quick Start

### Basic Interval Scheduling

```typescript
import { Job, Scheduler, seconds } from 'fluent-schedule';

// Create a job that runs every 5 seconds
const job = new Job()
  .every(seconds(5))
  .run(() => console.log('Task executed every 5 seconds!'));

// Create and start the scheduler
const scheduler = new Scheduler();
scheduler.add(job);

// This runs in the background (non-blocking)
scheduler.run();
```

### Time-Based Scheduling

```typescript
import { Job, Scheduler, Weekday } from 'fluent-schedule';

// Create a job that runs at 5:00 PM on weekdays
const job = new Job()
  .onWeekday()
  .at('17:00')
  .run(() => console.log('End of workday!'));

const scheduler = new Scheduler();
scheduler.add(job);

scheduler.run();
```

### Multiple Jobs

```typescript
import { Job, Scheduler, seconds, Weekday } from 'fluent-schedule';

const job1 = new Job()
  .every(seconds(10))
  .run(() => console.log('Heartbeat every 10 seconds'));

const job2 = new Job()
  .on(Weekday.Monday)
  .at('09:00')
  .run(() => console.log('Monday morning meeting'));

const job3 = new Job()
  .onWeekend()
  .at('10:00')
  .run(() => console.log('Weekend task'));

const scheduler = new Scheduler();
scheduler.add(job1);
scheduler.add(job2);
scheduler.add(job3);

scheduler.run();
```

### Async Tasks

```typescript
import { Job, Scheduler, minutes } from 'fluent-schedule';

const job = new Job()
  .every(minutes(5))
  .run(async () => {
    const data = await fetch('https://api.example.com/data');
    console.log('Data fetched:', await data.json());
  });

const scheduler = new Scheduler();
scheduler.add(job);
scheduler.run();
```

## API Overview

### Job Builder Methods

- `new Job()` - Create a new job
- `.every(duration)` - Run at fixed intervals (in milliseconds)
- `.at(time_str)` - Run at specific time (HH:MM or HH:MM:SS)
- `.on(weekday)` - Run on specific days of the week
- `.onWeekday()` - Run Monday through Friday
- `.onWeekend()` - Run Saturday and Sunday
- `.run(task)` - Set the task to execute (can be sync or async)

### Time Unit Helpers

The library provides helper functions to convert time units to milliseconds:

```typescript
import { seconds, minutes, hours } from 'fluent-schedule';

const fiveSeconds = seconds(5);    // 5000
const tenMinutes = minutes(10);    // 600000
const twoHours = hours(2);         // 7200000
```

### Weekday Enum

```typescript
import { Weekday } from 'fluent-schedule';

// Weekday.Sunday = 0
// Weekday.Monday = 1
// Weekday.Tuesday = 2
// Weekday.Wednesday = 3
// Weekday.Thursday = 4
// Weekday.Friday = 5
// Weekday.Saturday = 6
```

### Scheduler Methods

- `new Scheduler()` - Create a new scheduler
- `.add(job)` - Add a configured job (throws error if invalid)
- `.run()` - Start the scheduler (non-blocking)
- `.stop()` - Stop the scheduler

### Error Handling

The library uses typed errors for configuration issues:

```typescript
import { Job, Scheduler, InvalidTimeFormatError, TaskNotSetError } from 'fluent-schedule';

const invalidJob = new Job().at('99:99').run(() => {});
const scheduler = new Scheduler();

try {
  scheduler.add(invalidJob);
} catch (error) {
  if (error instanceof InvalidTimeFormatError) {
    console.error('Invalid time format:', error.message);
  } else if (error instanceof TaskNotSetError) {
    console.error('Job must have a task set with .run()');
  }
}
```

## Examples

See the `examples/` directory for more usage examples:

- `simple.ts` - Basic usage with multiple job types

Run an example:

```bash
npm run build
node dist/examples/simple.js
```

Or with TypeScript directly (using ts-node):

```bash
npx ts-node examples/simple.ts
```

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm test -- --coverage
```

## Documentation

The library is written in TypeScript with full type definitions. Your IDE should provide autocomplete and inline documentation.

For detailed API documentation, refer to the source code or generated TypeDoc documentation.

## Performance Considerations

- The scheduler runs in the background using `setTimeout` without blocking the event loop
- Jobs run sequentially in the order they become due
- Jobs should be lightweight to avoid delaying other scheduled tasks
- For CPU-intensive tasks, consider using worker threads
- Async jobs are supported and execute without blocking other jobs
- The scheduler uses a maximum sleep interval of 1 minute to balance responsiveness and efficiency

## Limitations

- Jobs run sequentially based on their scheduled times
- No persistence (schedules are lost on process restart)
- Time precision is limited to milliseconds
- No support for complex cron-like expressions
- The scheduler must be explicitly stopped with `.stop()` to clean up timers

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
