const path = require('path');
const moment = require('moment');
const EventEmitter = require('events');
const Queue = require("./Queue");
const Logger = require("./Logger");

const LOGGER = new Logger({ baseDir: path.resolve(__dirname, '../')});
const EVENTEMITTER = new EventEmitter();

const Timer = {
  timerInterval: null,

  on(event, handler) {
    EVENTEMITTER.on(event, handler);
  },

  init() {
    this.runNextTask();
  },

  runNextTask() {
    LOGGER.log("Determining next task to run...");
    const timeNow = Date.now();

    const availableTasks = Queue.getList();

    LOGGER.log(`Tasks queue:`.bold.cyan);
    availableTasks.forEach(({ id, next_run }, index) => LOGGER.log(`${index + 1} ${id.bold} - ${moment(next_run).format('YYYY-MM-DD HH:mm:ss').reset.cyan}`));

    // Get the first available task and run it
    const [firstTask] = availableTasks;

    // Next reset will depend if there's task to run
    let resetTimeInterval = 0;

    if ( !firstTask ) {
      LOGGER.log(`Scheduled Tasks doesn't detect any task in the config. Aborting`.red);
      return;
    }

    console.log(`Found first task in the queue: ${firstTask.id.bold}.`);

    // If task is not yet due to run,
    // just reset the timer
    if (!Queue.isTaskDueToRun(firstTask)) {
      console.log(`Task is not yet due to run, resetting timer.`);

      // Use the interval from now to firstTask for the reset
      resetTimeInterval = firstTask.next_run - timeNow;
      LOGGER.log(
        `None found, next task runs in ${Number(
          resetTimeInterval / 1000
        ).toFixed(2)} second(s) : ${firstTask.id.bold}`
      );
    }

    // Otherwise, run it!!!!!!
    else {
      // Run
      if (!firstTask.running) {
        LOGGER.log("Will run: " + firstTask.id);
        // Run the task
        // This will also update firstTask's next_run
        EVENTEMITTER.emit('taskstart', firstTask.id);
      } else {
        LOGGER.log("Task is already running: " + firstTask.id.bold);
      }

      // Re-sort tasks, this would still include the firstTask
      availableTasks.sort((taskA, taskB) =>
        taskA.next_run < taskA.next_run ? -1 : 1
      );

      // Get next available task,
      // Get its next_run and use it to
      // compute for the interval till the next timer tick
      const [nextTaskToRun] = availableTasks;

      // If next available task is still the one running,
      // Recompute next run
      if (nextTaskToRun.id === firstTask.id) {
        nextTaskToRun.computeNextRun();
      }
      resetTimeInterval = nextTaskToRun.next_run - timeNow;
    }

    // Reset timer
    if (resetTimeInterval) {
      this.resetTimer(resetTimeInterval);
    }
  },

  resetTimer(interval = 0) {
    this.timerInterval = setTimeout(this.runNextTask.bind(this), interval);
  },
};

module.exports = Timer;
