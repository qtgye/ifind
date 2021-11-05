const path = require("path");
const { existsSync } = require("fs-extra");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, "config");
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require("./lib/Timer");
const Task = require("./lib/Task");
const Database = require("./lib/Database");
const Logger = require("./lib/Logger");
const mapScheduleToFrequency = require("./utils/mapScheduleToFrequency");

const LOGGER = new Logger({ baseDir });

class ScheduledTasks {
  // List of all available processes, by id
  tasks = {};
  // ID of the currently running task
  runningTask = null;

  constructor() {
    this.ID = Date.now();
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    // Check tasks config for changes and apply updates
    const configTasks = config.tasks;
    const dbTasks = Database.getAll(Task.model);

    configTasks.forEach((configTask) => {
      const dbTask = dbTasks.find((task) => task.id === configTask.id);

      // Check for changes and save if there is any
      if (
        dbTask.name !== configTask.name ||
        dbTask.schedule !== configTask.schedule
      ) {
        Database.update(Task.model, dbTask.id, {
          name: configTask.name,
          schedule: configTask.schedule,
        });
      }

      this.addTask(dbTask);
    });

    // Initialize timer
    timer.on("taskstart", this.start.bind(this));
    timer.init();

    LOGGER.log("Scheduled Tasks Runner initialized".green);
  }

  runCommand(command, id) {
    const validCommands = ["start", "stop"];
    if (validCommands.includes(command)) {
      this[command].call(this, id);
    }

    return this.list();
  }

  /**
   * Gets the list of all available tasks
   */
  list() {
    // Get updated tasks list
    const tasks = Task.getAll();

    tasks.forEach((dbTask) => {
      const matchedCachedTask = this.tasks[dbTask.id];

      if (matchedCachedTask) {
        matchedCachedTask.next_run = dbTask.next_run
      }
    });

    // Apply formated schedule datetime
    return Object.values(this.tasks)
      .map((task) => ({
        ...task,
        frequency: mapScheduleToFrequency(task.schedule),
      }))
      .sort((taskA, taskB) => (taskA.next_run < taskB.next_run ? -1 : 1));
  }

  start(id) {
    if (this.runningTask || !(id in this.tasks)) {
      LOGGER.log(`Unable to run ${id}. Another task is currently running.`);
      return;
    }

    this.runningTask = id;

    LOGGER.log(`Starting task: ${id}`);
    const task = this.tasks[id];
    task.start();
  }

  stop(id) {
    if (id in this.tasks) {
      const _process = this.tasks[id];
      LOGGER.log("Killing task: ", id);
      _process.stop();
    }
  }

  getLogs() {
    return LOGGER.getAll();
  }

  getTask(taskID) {
    if (taskID in this.tasks) {
      const taskData = this.tasks[taskID];
      return {
        ...taskData,
        logs: this.tasks[taskID].getLogs(),
      };
    }
  }

  addTask(taskData) {
    const task = Task.initializeWithData(taskData);

    // Handle task events
    task.on("message", (...args) => this.onProcessMessage(args));
    task.on("exit", () => this.onProcessExit(task.id));

    // Save task to list
    this.tasks[task.id] = task;
  }

  onProcessMessage(processArgs) {
    LOGGER.log({ processArgs });
  }

  onProcessExit(id) {
    this.runningTask = null;
    LOGGER.log(`Process exitted: ${id}`);
  }
}

// const scheduledTasks = new ScheduledTasks;
// // TODO: Determine where to init, accounting for custom strapi instance
// // scheduledTasks.init()

module.exports = ScheduledTasks;
