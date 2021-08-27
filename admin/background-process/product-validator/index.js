require('colors');
require('../../helpers/customGlobals');

const args = require('minimist')(process.argv.slice(2));

const Validator = require('./lib/validator');
const _switch = require('./lib/switch');
const _log = require('./lib/logger');

const forced = 'force' in args;
const validator = new Validator(forced);

// Listen to start
_switch.listen('START', () => {
  // Start validator
  validator.start();
});

// Listen to stop
_switch.listen('STOP', () => {
  // Stop validator
  validator.stop();
});

// Listen to error
_switch.listen('ERROR', () => {
  // Stop validator
  validator.stop();
});

// Initialize switch watcher
_log('Initializing Product Validator'.green);
_switch.init();
