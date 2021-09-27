const path = require("path");
const { existsSync } = require("fs-extra");
const minimist = require('minimist');
const BackgroundProcess = require("../_lib/BackgroundProcess");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config');
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require('./lib/Timer');


class ScheduledTasks extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  startTask(taskID) {
    const matchedTask = config.tasks.find(task => task.id === taskID);

    if ( matchedTask && matchedTask.modulePath ) {
      const backgroundProcess = require(matchedTask.modulePath);

      console.log(`Starting background process: ${taskID}`);
      backgroundProcess.switch.start();
    }

    /*
      - If no other task is running, run
        - save current task
        - trigger switch on
        - start the task
      - Else, wait for another minute before running
    */
  }

  stopTask(taskID) {
    // # Stop task
  }

  onSwitchStart() {
    console.log('Switch start');
    timer.runNextTask();
  }

  onSwitchStop() {
    // Stop whatever is currently running
  }

  onSwitchError() {
    // Stop whatever task is currently running
  }
}

ScheduledTasks.name = 'Scheduled Tasks';

// Initialize Background Process
const scheduledTask = new ScheduledTasks(config);

module.exports = scheduledTask;
