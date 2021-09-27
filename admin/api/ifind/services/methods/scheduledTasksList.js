const scheduledTasks = appRequire('background-process/scheduled-tasks');

module.exports = async () => {
  const tasks = await scheduledTasks.getTasks();
  return tasks;
}
