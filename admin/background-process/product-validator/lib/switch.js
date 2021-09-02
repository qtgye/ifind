const path = require("path");
const { outputFileSync, readFileSync } = require("fs-extra");
const chokidar = require("chokidar");
const EventEmitter = require("events");

const _log = require('./logger');
const switchFilePath = path.resolve(__dirname, "../.switch");
const emitter = new EventEmitter();

const onSwitchChange = (listenedState, callback) => {
  if (isValidState(listenedState) && callback instanceof Function) {
    emitter.on('switchChange', (switchState) => {
      if (switchState === listenedState) {
        callback();
      }
    });
  }
};

// Sets the switch file to START
const start = () => {
  _log('(Switch) Starting...');
  outputFileSync(switchFilePath, "START");
};

// Sets the switch file to STOP
const stop = () => {
  _log('(Switch) Stopping...');
  outputFileSync(switchFilePath, "STOP");
};

// Sets the switch file to ERROR
const error = () => {
  outputFileSync(switchFilePath, "ERROR");
};

// Returns the current switch state
const getState = () => {
  const switchState = readFileSync(switchFilePath).toString().trim();
  return isValidState(switchState) ? switchState : null;
};

/**
 * Adds an event listener to switch state change
 * @param {String} state - The event
 * @param {Function} callback - Event handler
 */
const listen = (state, callback) => {
  onSwitchChange(state, callback);
};

// Ensures we can only use valid states : START,STOP,ERROR
const isValidState = (state) => /^\s*(START|STOP|ERROR)\s*$/.test(state);

// Listen to the switchFile, leveraging emitter to send events to listeners
const init = () => {
  let currentState = getState();

  chokidar.watch(switchFilePath).on("change", () => {
    const newState = getState();

    if ( isValidState(newState) && currentState !== newState ) {
      currentState = newState;
      emitter.emit('switchChange', newState);
    }
  });

  _log('Initialized switch file watcher for Product Validator');
}

module.exports = {
  start,
  stop,
  error,
  listen,
  init,
};
