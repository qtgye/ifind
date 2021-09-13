require('colors');
require('../../helpers/customGlobals');

const EventEmitter = require("events");
const Logger = require('./inc/Logger');
const Switch = require('./inc/Switch');

const EVENT_EMITTER = Symbol();

/**
 * BackgroundProcess
 *
 * CONFIG
 * baseDir - the root folder path for the background process
 */
class BackgroundProcess {
  constructor(config) {
    this.baseDir = config.baseDir;

    this[EVENT_EMITTER] = new EventEmitter();

    // Initialize switch
    this.switch = new Switch({
      baseDir: this.baseDir,
    });

    // Initialize logger
    this.logger = new Logger({
      baseDir: this.baseDir,
    });

    // Notify
    this.logger.log(`Initializing ${this.__proto__.constructor.name}`);
  }

  init() {
    // Ensure that switch is on STOP state upon initialization
    this.switch.stop();

    // Listen to start
    this.switch.listen('START', () => {
        if ( typeof this.onSwitchStart === 'function' ) {
          this.onSwitchStart();
        }
      });

    // Listen to stop
    this.switch.listen('STOP', () => {
        if ( typeof this.onSwitchStop === 'function' ) {
          this.onSwitchStop();
        }
      });

    // Listen to error
    this.switch.listen('ERROR', () => {
        if ( typeof this.onSwitchError === 'function' ) {
          this.onSwitchError();
        }
      });

    // Initialize switch
    this.switch.init();
  }

  on(event, callback) {
    this[EVENT_EMITTER].on(event, callback);
  }

  emit(event, data) {
    this[EVENT_EMITTER].emit(event, data);
  }
}

module.exports = BackgroundProcess;
