const path = require("path");
const { existsSync } = require("fs-extra");
const BackgroundProcess = require("../_lib/BackgroundProcess");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config.js');
const config = existsSync(configPath) ? require(configPath) : {};

class ScheduledTasks extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  afterInit() {
    /*
      LOGIC
      - Timer to check the queue and trigger task to start.
    */
  }

  startTask(taskID) {
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
// scheduledTask.init();
