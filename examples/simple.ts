import { Scheduler, Job, seconds, Weekday } from '../src/index.js';

// Define the tasks
const job1 = new Job()
  .every(seconds(5))
  .run(() => console.log('Task 1: Running every 5 seconds.'));

const job2 = new Job()
  .onWeekday()
  .at('17:00')
  .run(() => console.log('Task 2: Running at 5 PM on weekdays.'));

const job3 = new Job()
  .on(Weekday.Sunday)
  .at('09:30')
  .run(() => console.log('Task 3: Running at 9:30 AM on Sunday.'));

// Create a scheduler
const scheduler = new Scheduler();

try {
  // Add the jobs
  scheduler.add(job1);
  scheduler.add(job2);
  scheduler.add(job3);

  console.log('Starting scheduler...');
  // This call is non-blocking
  scheduler.run();
} catch (error) {
  console.error('Failed to add job:', error);
}

console.log('Scheduler is running in the background.');

// To stop it after some time (e.g., 30 seconds) for this example
// setTimeout(() => {
//   console.log('Stopping scheduler.');
//   scheduler.stop();
// }, 30000);