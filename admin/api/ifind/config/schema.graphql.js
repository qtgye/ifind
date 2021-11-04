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
  enum TASK_LOG_TYPE {
    INFO
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
    type: TASK_LOG_TYPE
    message: String
  }

  type Task {
    name: String!
    status: TASK_STATUS
    logs: [TaskLogEntry]
  }

  type ScheduledTask {
    id: String
    name: String
    status: SCHEDULED_TASK_STATUS
    frequency: String
    next_run: Float
    hasModule: Boolean
  }

  enum SCHEDULED_TASK_ACTION {
    start
    stop
  }

  type DealType {
      name: String
      label: String
      source: Source
  }

  type ScheduledTaskPayload {
    error: String
    data: [ScheduledTask]
  }

  type ScheduledTaskListPayload {
    serverTimeUnix: String
    serverTimeFormatted: String
    tasks: [ScheduledTask]
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

        return { serverTimeUnix, serverTimeFormatted, tasks };
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
