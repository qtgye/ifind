require('colors');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

require('../../helpers/customGlobals');

const adminStrapi = appRequire("scripts/strapi-custom");
const { isAmazonLink, scrapeAmazonProduct } = appRequire("helpers/amazon");
const { getDetailsFromURL: getDetailsFromEbayURL } = appRequire("helpers/ebay");
const { getDetailsFromURL: getDetailsFromAliExppressURL } =
  appRequire("helpers/aliexpress");

const BackgroundProcess = require('../_lib/BackgroundProcess');

const forced = 'force' in args;

const RUNNING_STATUS = Symbol();

class ProductValidator extends BackgroundProcess {
  constructor({
    forced = false,
  }) {
    super({
      baseDir: path.resolve(__dirname),
    });

    this.forced = forced;
    this[RUNNING_STATUS] = false;
  }

  onSwitchStart() {
    this.logger.log("Starting validator");''

    if (this[RUNNING_STATUS]) {
      return;
    }

    this[RUNNING_STATUS] = true;

    (new Promise((resolve, reject) => {
      return this.validate()
      .then(resolve)
      .catch(reject);
    }))
    .catch((err) => {
      console.log('Validator start error', err);
    });
  }

  onSwitchStop() {
    // Stop validator
    if ( this.running ) {
      this.cancel();
    } else {
      this.stop();
    }
  }

  onSwitchError() {
    // Stop validator
    this.stop();
  }

  cancel() {
    this.emit('cancel');
  }

  stop() {
    this.logger.log("Stopping validator");

    if (this[RUNNING_STATUS]) {
      this[RUNNING_STATUS] = false;
      this.emit("stop");
    }
  }

  handleError(err) {
    if (err.message === "cancel") {
      if ( this.running ) {
        this.logger.log("Validator Cancelled");
      }
      this.stop();
    } else {
      this.logger.log(`${err.message} ${`STACK`.black.bold} ==> ${err.stack.gray}`, "ERROR");
      this.switch.error();
    }
  }

  get running () {
    return this[RUNNING_STATUS];
  }

  async validate() {
    (new Promise(this.startCancellableValidator.bind(this)))
    .catch(this.handleError.bind(this));
  }

  async startCancellableValidator(resolve, reject) {
    this.on('cancel', () => {
      // Throw an error in order to cancel current validation process
      reject(new Error('cancel'));
    });

    const strapi = await adminStrapi();

    const queryParams = {
      status: "published",
      _limit: 9999,
      _sort: 'id:desc',
    };

    // Include all products if forced is true
    if (this.forced && queryParams.status) {
      delete queryParams.status;
    }

    const sources = await strapi.services.source.find();
    const foundProducts = await strapi.services.product.find(queryParams);
    const productsWithIssues = [];

    // Sources
    const ebaySource = sources.find(({ name }) => /ebay/i.test(name));
    const aliexpressSource = sources.find(({ name }) => /ali/i.test(name));

    this.logger.log(`Running validator on ${foundProducts.length} product(s)...`.cyan);

    for (let i = 0; i < foundProducts.length && this[RUNNING_STATUS]; i++) {
      // For every 10 products processed,
      // add a 3s delay before continuing
      if ( i > 0 && i % 10 === 0 ) {
        this.logger.log(`Pausing for 3 seconds before proceeding...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }


      const product = foundProducts[i];
      const productIssues = [];

      this.logger.log(
        `[ ${i + 1} of ${foundProducts.length} ]`.cyan.bold +
          ` Validating - [${String(product.id).bold}] ${product.title}`
      );

      // Validate amazon link
      if (!isAmazonLink(product.amazon_url)) {
        productIssues.push("amazon_link_invalid");
      } else {
        try {
          const scrapedDetails = await scrapeAmazonProduct(
            product.amazon_url,
            "en",
            true
          );

          if (!scrapedDetails) {
            productIssues.push("amazon_link_unavailable");
          }
        } catch (err) {
          console.error(err);
          productIssues.push("amazon_link_unavailable");
        }
      }

      // Validate other URLs
      if (product.url_list && product.url_list.length) {
        for (const urlData of product.url_list) {
          switch (urlData.source.id) {
            // Validate Ebay
            case ebaySource.id:
              if (!(await getDetailsFromEbayURL(urlData.url))) {
                productIssues.push("ebay_link_invalid");
              }
              break;

            // Validate AliExpress
            case aliexpressSource.id:
              try {
                if ( !(await getDetailsFromAliExppressURL(urlData.url)) ) {
                  throw new Error('Invalid AlixExpress Link')
                }
              } catch (err) {
                productIssues.push("aliexpress_link_invalid");
              }
              break;
          }
        }
      }

      if (productIssues.length) {
        product.product_issues = {};

        productIssues.forEach((product_issue) => {
          product.product_issues[product_issue] = true;
        });

        // Save product as draft
        product.status = "draft";
        await strapi.services.product.updateProduct(
          product.id,
          { status: "draft", product_issues: product.product_issues },
          { price: false, amazonDetails: false },
          { change_type: "product_validator_results" }
        );

        this.logger.log(
          `Issue(s) were found for [`.yellow +
            String(product.id).yellow.bold +
            `] ${product.title}`.yellow,
          "ERROR"
        );
        productsWithIssues.push(product.id);
      }
    }

    this.logger.log(" DONE ".bgGreen.white.bold);
    this.switch.stop();
  }
}

ProductValidator.name = 'Product Validator';

const productValidator = new ProductValidator({ forced });

// Initialize Product Validator if provided through cli
if ( args.init ) {
  productValidator.init();
}

module.exports = productValidator;
