/**
 * TODO: Abstract out custom Schema definitions for better structure
 */
const moment = require("moment");

module.exports = {
  definition: `
  enum TASK_STATUS {
    START
    STOP
    ERROR
  }

  enum SCHEDULED_TASK_NAME {
    product_validator
  }

  enum SCHEDULED_TASK_STATUS {
    stopped
    running
  }

  type TaskLogEntry {
    date_time: String
    type: String
    message: String
  }

  type Task {
    name: String!
    status: TASK_STATUS
    logs: [TaskLogEntry]
    canRun: Boolean
  }

  type ScheduledTask {
    id: String
    name: String
    status: SCHEDULED_TASK_STATUS
    frequency: String
    next_run: Float
    countdown: String
    last_run: Float

    # Computed values
    hasModule: Boolean
    canRun: Boolean
  }

  enum SCHEDULED_TASK_ACTION {
    start
    stop
  }

  type DealTypeLabelTranslation {
    language: String!
    label: String
  }

  type DealType {
    name: String
    label: [DealTypeLabelTranslation]
    source: Source
    last_run: String
  }

  type ScheduledTaskPayload {
    error: String
    data: [ScheduledTask]
  }

  type ScheduledTaskListPayload {
    serverTimeUnix: String
    serverTimeFormatted: String
    tasks: [ScheduledTask]
    logs: [TaskLogEntry]
  }
  `,
  query: `
  getTask ( id: String! ): Task
  scheduledTasksList: ScheduledTaskListPayload
  sheduledTasks ( command: String, id: String ): ScheduledTaskPayload
  `,
  mutation: `
  triggerTask ( taskID: String, action: SCHEDULED_TASK_ACTION ): ScheduledTaskListPayload
  `,
  type: {},
  resolver: {
    Query: {
      async sheduledTasks(_, { command, id }) {
        const tasks = strapi.scheduledTasks.runCommand(command, id);
        return { tasks };
      },
      async scheduledTasksList() {
        const serverTime = moment.utc();
        const serverTimeUnix = String(serverTime.valueOf());
        const serverTimeFormatted = serverTime.format("YYYY-MMM-DD HH:mm:ss");
        const tasks = strapi.scheduledTasks.list();
        const logs = strapi.scheduledTasks.getLogs();

        return { serverTimeUnix, serverTimeFormatted, tasks, logs };
      },
      async getTask(_, { id }) {
        return strapi.scheduledTasks.getTask(id);
      },
    },
    Mutation: {
      async triggerTask(_, args) {
        const { action: command, taskID: id } = args;
        const tasks = strapi.scheduledTasks.runCommand(command, id);
        return { tasks };
      },
    },
  },
};
