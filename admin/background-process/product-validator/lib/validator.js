const EventEmitter = require("events");

const adminStrapi = appRequire('scripts/strapi-custom');
const { isAmazonLink, scrapeAmazonProduct } = appRequire("helpers/amazon");
const { getDetailsFromURL: getDetailsFromEbayURL } = appRequire("helpers/ebay");
const { getDetailsFromURL: getDetailsFromAliExppressURL } =
  appRequire("helpers/aliexpress");

const _switch = require("./switch");
const _log = require("./logger");

const VALIDATOR_PROCESS_PROMISE = Symbol();
const EVENT_EMITTER = Symbol();

class Validator {
  constructor(forced = false) {
    this.forced = forced;
    this.running = false;
    this[EVENT_EMITTER] = new EventEmitter();
  }

  start() {
    _log("Starting validator");

    if (this.running) {
      return;
    }

    this.running = true;

    this[VALIDATOR_PROCESS_PROMISE] = new Promise(async (resolve, reject) => {
      await this.validate();
      resolve();
    });

    this[VALIDATOR_PROCESS_PROMISE].catch((err) => this.onError(err));
  }

  stop() {
    _log("Stopping validator");

    if (this.running && this[VALIDATOR_PROCESS_PROMISE]) {
      this.running = false;
      this[EVENT_EMITTER].emit("stop");
    }
  }

  onError(err) {
    if (err.message === "cancel") {
      _log('Validator Cancelled');
    } else {
      _log(err.message + err.stack.gray, 'ERROR');
    }

    this.stop();
  }

  async validate() {
    this[EVENT_EMITTER].on("stop", () => {
      // Throwing error in order to cancel
      throw new Error("cancel");
    });

    const strapi = await adminStrapi();

    const queryParams = {
      _limit: 9999,
      status: "published",
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

    _log(`Running validator on ${foundProducts.length} product(s)...`.cyan);

    for (let i = 0; i < foundProducts.length && this.running; i++) {
      const product = foundProducts[i];
      const productIssues = [];

      _log(
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
              if (!(await getDetailsFromAliExppressURL(urlData.url))) {
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

        _log(
          `Issue(s) were found for [`.yellow +
            String(product.id).yellow.bold +
            `] ${product.title}`.yellow,
          "ERROR"
        );
        productsWithIssues.push(product.id);
      }
    }

    _log(" DONE ".bgGreen.white.bold);
    _switch.stop();
  }
}

module.exports = Validator;
