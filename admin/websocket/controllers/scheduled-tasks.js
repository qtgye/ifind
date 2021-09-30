const Controller = require('../lib/Controller');
const Task = require('../../background-process/scheduled-tasks/lib/Task');

class ScheduledTasks extends Controller {
  constructor(connection) {
    super(connection);
  }

  async onopen() {
    // Get initial scheduled tasks
    const tasks = await this.sendTasks();
    this.handleTaskEvents(tasks);
  }

  onmessage(message) {
    console.log('scheduled tasks route', { message });
  }

  handleTaskEvents(tasks) {
    tasks.forEach(task => {
      const taskInstance = Task.initializeWithData(task);

      taskInstance.on('statuschange', e => {
        console.log('statuschange');
        this.sendTasks();
      });
    });
  }

  async sendTasks() {
    const tasks = await strapi.services.ifind.scheduledTasksList();

    this.send({ tasks });

    return tasks;
  }
}

module.exports = ScheduledTasks;
