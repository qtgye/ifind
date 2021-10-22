const bpm = appRequire('scheduled-tasks');

/**
 * TODO: Abstract out custom Schema definitions for better structure
 */

module.exports = {
  definition: `
  enum BACKGROUND_PROCESS_STATUS {
    START
    STOP
    ERROR
  }

  enum BACKGROUND_PROCESS_LOG_TYPE {
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

  type BackgroundProcessLogEntry {
    date_time: String
    type: BACKGROUND_PROCESS_LOG_TYPE
    message: String
  }

  type BackgroundProcess {
    name: String!
    status: BACKGROUND_PROCESS_STATUS
    logs: [BackgroundProcessLogEntry]
  }

  type ScheduledTask {
    id: String
    name: String
    status: SCHEDULED_TASK_STATUS
    frequency: String
    next_run: Float
    hasBackgroundProcess: Boolean
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
  `,
  query: `
  getBackgroundProcess ( backgroundProcess: String! ): BackgroundProcess
  triggerScheduledTask ( scheduledTask: SCHEDULED_TASK_NAME!, status: BACKGROUND_PROCESS_STATUS! ): ScheduledTask
  scheduledTasksList: [ScheduledTask]
  sheduledTasks ( command: String, id: String ): ScheduledTaskPayload
  `,
  mutation: `
  triggerTask ( taskID: String, action: SCHEDULED_TASK_ACTION ): [ScheduledTask]
  `,
  type: {},
  resolver: {
    Query: {
      async sheduledTasks(_, { command, id }) {
        const data = bpm.runCommand(command, id);
        return { data };
      },
      async scheduledTasksList() {
        const tasks = bpm.list();
        return tasks;
      },
      async getBackgroundProcess(_, { backgroundProcess }) {
        return bpm.getTask(backgroundProcess);
      },
    },
    Mutation: {
      async triggerTask(_, args) {
        const { action: command, taskID: id } = args;
        const tasks = bpm.runCommand(command, id);
        return tasks;
      },
    },
  },
};
