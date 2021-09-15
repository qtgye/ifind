const { existsSync } = require('fs');
const path = require('path');

const { frequencies } = require('../config');
const Database = require('./Database');
const Logger = require('./Logger');
const Switch = require('./Switch');

const tasksRoot = path.resolve(__dirname, '../tasks');

/**
 * A Task should have a corresponding BackgroundProcess
 * This class only triggers a BackgroundProcess to start/stop
 * This does not contain any logic for the BackgroundProcess
 */
class Task {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.schedule = config.schedule;
    this.next_run = config.next_run;

    // Get taskPath
    const taskPath = path.resolve(tasksRoot, this.id);
    if ( existsSync(taskPath) ) {
      this.taskPath = taskPath;
    }
  }

  hasScript() {
    return this.taskPath ? true : false;
  }

  start() {
    if ( this.taskPath ) {
      // Compute for the next run
      this.computeNextRun();

      // Log
      Logger.log(`Triggered a Task run: ${this.name}`);

      // Trigger switch start
      Switch.start();

      // Run the task
      require(this.taskPath);
    }
  }

  stop() {

  }

  log(message = '', type) {
    const formattedLogMessage = this.logger.formatLogMessage(message, type);

    // Save formattedLogMessage to db
  }

  // Computes next run schedule depending on config.shedule
  // Save the computed update in database
  computeNextRun() {
    const now = Date.now();
    const { schedule } = this;
    // Default to daily
    const next_run = now + frequencies[schedule || 'seconds'];

    // Save to DB
    Database.update( Task.model, this.id, { next_run });

    // Update this task
    this.next_run = next_run;
  }

  // Adjusts next run by the given milliseconds
  adjustNextRun( milliseconds = 0 ) {
    this.next_run = (this.next_run || 0) + milliseconds;

    // Save to DB
    Database.update( Task.model, this.id, { next_run: this.next_run });
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedule,
      initial_run: this.initial_run,
      next_run: this.next_run,
    }
  }

  static getAll() {
    return Database.getTasks().map(rawTaskData => new Task(rawTaskData));
  }
}

/**
 * Static props
 */
Task.model = 'task';

/**
 * Static methods
 */
Task.getAll = () => {
  return (
    // Get alll database entries
    Database.getAll( Task.model )
    // Instantiate as Task instances
    .map(rawTask => new Task(rawTask))
    // Filter only ones that have script
    .filter(task => task.hasScript())
  );
};

module.exports = Task;
