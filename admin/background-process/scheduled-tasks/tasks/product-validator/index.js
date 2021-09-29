const path = require('path');
const Task = require('../../lib/Task');

const productValidatorPath = path.resolve(__dirname, '../../../product-validator');
const productValidator = require(productValidatorPath);

/**
 * This only triggers the Product Validator to run
 * This does not intend to intialize a separate instance
 * of the ProductValidator
 */
class ProductValidatorTask extends Task {
  constructor(rawData) {
    super(rawData);

    // Get current productValidator state
    this.status = productValidator.switch.getState() === 'START' ? 'running' : 'stopped';
  }

  init() {
    if ( !this.next_run ) {
      this.computeNextRun();
    }

    productValidator.on('start', this.onProductValidatorStart.bind(this));
    productValidator.on('stop', this.onProductValidatorStop.bind(this));
    productValidator.on('error', this.onProductValidatorStop.bind(this));
  }

  onStart() {
    console.log('Will start ProductValidator background process...'.cyan);
    productValidator.switch.start();
  }

  onProductValidatorStart() {
    this.status = 'running';
  }

  onProductValidatorStop() {
    console.log('Stopping ProductValidator task...');
    this.stop();
  }
}

module.exports = ProductValidatorTask;
