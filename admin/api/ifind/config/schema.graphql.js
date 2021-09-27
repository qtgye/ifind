module.exports = {
  definition: `
  enum BACKGROUND_PROCESS_STATUS {
    START
    STOP
    ERROR
  }

  enum BACKGROUND_PROCESS_NAME {
    product_validator
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
    status: BACKGROUND_PROCESS_STATUS
    logs: [BackgroundProcessLogEntry]
  }

  type ScheduledTask {
    name: String
    status: SCHEDULED_TASK_STATUS
  }
  `,
  query: `
  getBackgroundProcess ( backgroundProcess: BACKGROUND_PROCESS_NAME! ): BackgroundProcess
  triggerBackgroundProcess ( backgroundProcess: BACKGROUND_PROCESS_NAME!, status: BACKGROUND_PROCESS_STATUS! ): BackgroundProcess
  triggerScheduledTask ( scheduledTask: SCHEDULED_TASK_NAME!, status: BACKGROUND_PROCESS_STATUS! ): ScheduledTask
  scheduledTasksList: [ScheduledTask]
  `,
  mutation: ``,
  type: {},
  resolver: {
    Query: {
      async scheduledTasksList(_, ) {
        const tasks = await strapi.services.ifind.scheduledTasksList();
        console.log({ tasks });
        return tasks;
      },
      async getBackgroundProcess(_, { backgroundProcess }) {
        const backgroundProcessData =
          await strapi.services.ifind.getBackgroundProcess(backgroundProcess);
        return backgroundProcessData;
      },
      async triggerBackgroundProcess(_, { backgroundProcess, status }) {
        const backgroundProcessData =
          await strapi.services.ifind.triggerBackgroundProcess(
            backgroundProcess,
            status
          );
        return backgroundProcessData;
      },
    },
  },
};
