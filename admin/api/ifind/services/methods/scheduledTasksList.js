const scheduledTasks = appRequire('background-process/scheduled-tasks');
const { frequencies } = appRequire('background-process/scheduled-tasks/config');

const mapScheduleToFrequency = (scheduleMs) => {
  for ( let frequency in frequencies ) {
    if ( scheduleMs === frequencies[frequency] ) {
      return frequency;
    }
  }
  return null;
};

module.exports = async () => {
  const tasks = await scheduledTasks.getTasks();
  return tasks.map(task => ({
    ...task,
    frequency: mapScheduleToFrequency(task.schedule),
  }));
}
