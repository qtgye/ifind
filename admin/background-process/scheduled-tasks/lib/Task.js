const { existsSync } = require("fs");
const path = require("path");
const EventEmitter = require('events');

const Switch = require("../../_lib/inc/Switch");
const { frequencies } = require("../config");
const Database = require("./Database");
const Logger = require("./Logger");
const Model = require("./Model");

const tasksRoot = path.resolve(__dirname, "../tasks");
const backgroundProcessesRoot = path.resolve(__dirname, "../../");

const EVENT_EMITTER = Symbol();

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
    this.taskBackgroundProcessPath = path.resolve(backgroundProcessesRoot, this.id);

    // Compute next_run if none
    if ( !this.next_run ) {
      this.computeNextRun();
    }

    this.backgroundProcessSwitch = new Switch({
      baseDir: this.taskBackgroundProcessPath,
    });
    this.backgroundProcessSwitch.init();

    // Get current state
    this.status = this.backgroundProcessSwitch.getState() === 'START' ? 'running' : 'stopped';
  }

  init() {
    this.watchBackgroundProcessSwitch();
  }

  hasModule() {
    return this.taskModulePath && existsSync(this.taskModulePath);
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
        this.setStatus('stopped');
        this.onStart();
      }
    }
  }

  stop() {
    this.setStatus('stopped');

    // Log
    Logger.log(`Task stops: ${this.name}`);
  }

  setStatus(status) {
    if ( status !== this.status ) {
      this.status = status;
      this.update({ status });
      this.emit('statuschange', this);
    }
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
    return this.sanitizeData(this);
  }

  watchBackgroundProcessSwitch() {
    // Listen to start
    this.backgroundProcessSwitch.listen("START", () => {
      this.computeNextRun();
      this.setStatus('running');
    });

    // Listen to stop
    this.backgroundProcessSwitch.listen("STOP", () => {
      this.setStatus('stopped');
    });

    // Listen to error
    this.backgroundProcessSwitch.listen("ERROR", () => {
      this.setStatus('stopped');
    });
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
