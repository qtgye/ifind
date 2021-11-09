const path = require("path");
const moment = require("moment");
const { existsSync } = require("fs-extra");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, "config");
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require("./lib/Timer");
const Task = require("./lib/Task");
const Database = require("./lib/Database");
const Logger = require("./lib/Logger");
const Queue = require("./lib/Queue");
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

    // Info from queue
    Queue.on("info", (info) => LOGGER.log(info));

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

    LOGGER.log("Scheduled Tasks Runner initialized".magenta.bold);
  }

  runCommand(command, id) {
    const validCommands = ["start", "stop"];
    if (validCommands.includes(command)) {
      const args = [id];

      switch (command) {
        case "start":
          args.push(true);
          break;
        default:
      }

      this[command].apply(this, args);
    }

    return this.list();
  }

  /**
   * Gets the list of all available tasks
   */
  list() {
    // Get updated tasks list
    const tasks = Queue.getList();

    tasks.forEach((dbTask) => {
      const matchedCachedTask = this.tasks[dbTask.id];

      if (matchedCachedTask) {
        matchedCachedTask.next_run = dbTask.next_run;
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

  start(id, resetNextRun = false) {
    if (!(id in this.tasks)) {
      LOGGER.log(
        `${id.bold} is not in the list of tasks. Kindly verify the task ID.`
      );
      return;
    }

    if (this.runningTask) {
      if (this.runningTask === id) {
        LOGGER.log(`Task is still running.`.cyan);
      } else {
        LOGGER.log(
          `Unable to run `.yellow +
            id.bold.yellow +
            `. Another task is currently running - `.yellow +
            this.runningTask.bold.yellow
        );
      }

      if (Queue.isTaskDueToRun(this.tasks[id])) {
        this.tasks[id].computeNextRun();
      }

      return;
    }

    this.runningTask = id;

    LOGGER.log(` Starting task: `.bgGreen.bold.black +  `${id} `.bgGreen.black);
    const task = this.tasks[id];

    // Manually running a task allows
    // to reset the next_run at the current time
    // so that the computed next_run will base on the current time
    if (resetNextRun) {
      task.update({
        next_run: Date.now(),
      });
    }

    // Start task
    task.start();

    // Show updated queue for the next run
    const newQueue = Queue.getList();
    LOGGER.log(`New queue:`.bold.green);
    newQueue.forEach(({ id, next_run }, index) => {
      LOGGER.log(
        ` ${index + 1} - ${id.bold} - ${moment
          .utc(next_run)
          .format("YYYY-MM-DD HH:mm:ss")} ${
          this.runningTask === id ? "- running".bold.yellow : ""
        }`
      );
    });
  }

  stop(id) {
    if (id in this.tasks) {
      const _process = this.tasks[id];
      LOGGER.log(`Killing task: ${id.bold}`);
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
    LOGGER.log(` Process exitted: `.black.bold.bgCyan + `${id} `.black.bgCyan);
  }
}

module.exports = ScheduledTasks;
