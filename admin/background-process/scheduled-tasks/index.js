const path = require("path");
const { existsSync } = require("fs-extra");
const minimist = require('minimist');
const BackgroundProcess = require("../_lib/BackgroundProcess");
const BPSwitch = require("../_lib/inc/Switch");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config');
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require('./lib/Timer');
const Task = require('./lib/Task');


class ScheduledTasks extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  afterInit() {
    // Ensure database contents
    timer.runNextTask();
  }

  startTask(taskID) {
    const matchedTask = Task.get(taskID);

    if ( matchedTask && matchedTask.backgroundProcessSwitch ) {
      console.log(`Starting task: ${taskID}`);
      matchedTask.backgroundProcessSwitch.start();
    }
  }

  stopTask(taskID) {
    const matchedTask = Task.get(taskID);

    if ( matchedTask && matchedTask.backgroundProcessSwitch ) {
      console.log(`Stopping task: ${taskID}`);
      matchedTask.backgroundProcessSwitch.stop();
    }
  }

  async getTasks() {
    return Task.getAll();
  }

  async getTask(taskId) {
    Task.get(taskId);
  }

  onSwitchStart() {
    // console.log('Switch start');
  }

  onSwitchStop() {
    // Stop whatever is currently running
  }

  onSwitchError() {
    // Stop whatever task is currently running
  }
}

ScheduledTasks.backgroundProcessName = 'Scheduled Tasks';

// Initialize Background Process
const scheduledTask = new ScheduledTasks(config);

module.exports = scheduledTask;
