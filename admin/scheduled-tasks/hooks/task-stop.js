/**
 * Fires when a task is stopped.
 * e.g, when process is exitted/killed
 */
module.exports = async (taskID) => {
  // Do whatever
  console.log(`Tasks stops: ${taskID}`);
}
