const { existsSync } = require("fs");
const path = require("path");

const { frequencies } = require("../config");
const Database = require("./Database");
const Logger = require("./Logger");
const Model = require("./Model");

const tasksRoot = path.resolve(__dirname, "../tasks");

/**
 * Task base class
 *
 * A Task should have a corresponding BackgroundProcess
 * This class only triggers a BackgroundProcess to start/stop
 * This does not contain any logic for the BackgroundProcess
 */
class Task extends Model {
  constructor(config) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.schedule = config.schedule;
    this.next_run = config.next_run;
    this.status = config.status || "stopped";

    // Get taskModulePath
    this.taskModulePath = path.resolve(tasksRoot, this.id);
  }

  hasModule() {
    return this.taskModulePath ? true : false;
  }

  // Task module should have onStart
  start() {
    // If process is already runnning,
    // no need to proceed
    if (this.running) {
      return;
    }

    if (this.taskModulePath) {
      // Log
      Logger.log(`Triggered a Task run: ${this.name}`);

      // Compute for the next run
      this.computeNextRun();

      // Run the task
      if (typeof this.onStart === "function") {
        this.onStart();
      }
    }
  }

  stop() {
    this.update({ status: "stopped" });

    // Log
    Logger.log(`Task stops: ${this.name}`);
  }

  get running() {
    return this.status === "running";
  }

  log(message = "", type) {
    const formattedLogMessage = this.logger.formatLogMessage(message, type);

    // Save formattedLogMessage to db
  }

  // Computes next run schedule depending on config.shedule
  // Save the computed update in database
  async computeNextRun() {
    const now = Date.now();
    const { schedule } = this;

    while (!this.next_run || this.next_run < now) {
      this.next_run = now + (schedule || frequencies["daily"]); // Default to daily
    }

    // Save to DB
    Database.update(Task.model, this.id, { next_run: this.next_run });
  }

  // Adjusts next run by the given milliseconds
  adjustNextRun(milliseconds = 0) {
    this.next_run = (this.next_run || 0) + milliseconds;

    // Save
    this.update({ next_run: this.next_run });
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedule,
      initial_run: this.initial_run,
      next_run: this.next_run,
      status: this.status,
    };
  }
}

/**
 * Static props
 */
Task.model = "task";

/**
 * Static methods
 *
 */
Task.initializeWithData = function (rawData) {
  const instance = new this(rawData);

  if (typeof instance.init === "function") {
    instance.init();
  }

  return instance;
};
Task.getAll = function () {
  return (
    // Get alll database entries
    Database.getAll(this.model)
      // Instantiate as Task instances
      .map((rawData) => {
        const taskPath = path.resolve(tasksRoot, rawData.id);

        // If this task has a child Task class, use it
        if (existsSync(taskPath)) {
          const TaskModule = require(taskPath);
          return TaskModule.initializeWithData(rawData);
        }

        // Use base Task class by default
        return Task.initializeWithData(rawData);
      })
  );
};

module.exports = Task;
