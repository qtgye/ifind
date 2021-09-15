const Task = require("./Task");

// When checking for a task's next_run, allow this allowance in milliseconds
// To determine whether the task is due to run (plus/minus)
const TASK_NEXT_RUN_ALLOWANCE = 1000 * 10; // +/- 10 seconds allowance

const Queue = {
  getList() {
    // Current Time
    const currentTime = Date.now();

    // Get queue
    let tasks = Task.getAll();

    const computedTasks = tasks.map((task) => {
      // Ensure there is next_run
      // Or next_run is within the runnable allowance
      if (
        !task.next_run ||
        (task.next_run < currentTime && !this.isTaskDueToRun(task))
      ) {
        task.computeNextRun();
      }

      return task;
    });

    // Ensure no 2 tasks have the same next_run
    computedTasks.forEach((task) => {
      const taskWithSameTime = computedTasks.find(
        (otherTask) =>
          otherTask.id !== task.id && otherTask.next_run === task.next_run
      );

      // If there's another task that will run the same time,
      // Adjust this task's next_run to 10mins
      if (taskWithSameTime) {
        task.adjustNextRun(1000 * 60 * 10);
      }
    });

    // Sort by next_run
    computedTasks.sort((taskA, taskB) =>
      taskA.next_run < taskB.next_run ? -1 : 1
    );

    return computedTasks;
  },

  isTaskDueToRun(task) {
    const timeNow = Date.now();
    const nextRunDiff = Math.abs(task.next_run - timeNow);

    // Returns true if time difference between time now and next_run
    // is within the allowance
    return nextRunDiff <= TASK_NEXT_RUN_ALLOWANCE;
  },
};

module.exports = Queue;
