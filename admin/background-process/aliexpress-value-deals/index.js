const path = require("path");
const { existsSync } = require("fs-extra");
const adminStrapi = appRequire("scripts/strapi-custom");
const BackgroundProcess = require("../_lib/BackgroundProcess");
const { getValueDeals } = require("../../helpers/aliexpress/value-deals");
const { getDetailsFromURL } = require('../../helpers/aliexpress/api');

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, "config");
const config = existsSync(configPath) ? require(configPath) : {};

class AliExpressValueDeals extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  afterInit() {}

  onSwitchStart() {
    this.fetchValueDeals();
  }

  onSwitchStop() {
    // Stop whatever is currently running
  }

  onSwitchError() {
    // Stop whatever task is currently running
  }

  async fetchValueDeals() {
    new Promise(this.startCancellableValueDealsFetcher.bind(this)).catch(
      this.handleError.bind(this)
    );
  }

  handleError(err) {
    if (err.message === "cancel") {
      if (this.running) {
        this.logger.log("Price Updater Cancelled");
      }
      this.stop();
    } else {
      this.logger.log(
        `${err.message} ${`STACK`.black.bold} ==> ${err.stack.gray}`,
        "ERROR"
      );
      this.switch.error();
    }
  }

  async startCancellableValueDealsFetcher(resolve, reject) {
    this.on("cancel", () => {
      // Throw an error in order to cancel current validation process
      reject(new Error("cancel"));
    });

    const strapi = await adminStrapi();
    const [
      aliexpressSource,
      germanRegion,
    ] = await Promise.all([
      strapi.services.source.findOne({ name_contains: 'aliexpress' }),
      strapi.services.region.findOne({ code: 'de' }),
    ]);

    console.log({ aliexpressSource, germanRegion });

    try {
      const valueDealsLinks = await getValueDeals();

    const productsData = [];

    for (let productLink of valueDealsLinks) {
      console.log(`Fetching data for: ${productLink}`.gray);

      try {
        const productData = await getDetailsFromURL(productLink);
        productsData.push(productData);

        console.log(
          `[ ${productsData.length} ] Details fetched for ${productData.title.bold}`
            .green
        );

        // Save new product

        // We only need 20 products
        if (productsData.length == 20) {
          break;
        }
      } catch (err) {
        console.log(`Error while fetching ${productLink}: ${err.message}`);
      }
    }

    console.log({ productsData });
    console.log(`Total of ${productsData.length} products has been fetched.`);

    // const queryParams = {
    //   _limit: 9999,
    //   _sort: "id:desc",
    // };

    // const sources = await strapi.services.source.find();
    // const foundProducts = await strapi.services.product.find(queryParams);

    // // Sources
    // const ebaySource = sources.find(({ name }) => /ebay/i.test(name));
    // const aliexpressSource = sources.find(({ name }) => /ali/i.test(name));

    // this.logger.log(
    //   `Running price updater on ${foundProducts.length} product(s)...`.cyan
    // );

    this.logger.log(" DONE ".bgGreen.white.bold);
    this.switch.stop();
    }
    catch (err) {
      console.error(err);
      this.switch.stop();
    }
  }
}

AliExpressValueDeals.backgroundProcessName = "AliExpress Value Deals";

// Initialize Background Process
const aliExpressValueDeals = new AliExpressValueDeals(config);

module.exports = aliExpressValueDeals;
