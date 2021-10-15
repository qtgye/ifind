const path = require("path");
const { existsSync } = require("fs-extra");
const adminStrapi = appRequire("scripts/strapi-custom");
const BackgroundProcess = require("../_lib/BackgroundProcess");
const getLightningOffers = appRequire('helpers/amazon/lighning-offers');

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, "config");
const config = existsSync(configPath) ? require(configPath) : {};

class AmazonLightningOffsers extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  afterInit() {}

  onSwitchStart() {
    this.logger.log("Fetching Amazon Lightning Offers...".cyan);
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
    const [amazonSource, germanRegion] = await Promise.all([
      strapi.services.source.findOne({ name_contains: "amazon" }),
      strapi.services.region.findOne({ code: "de" }),
    ]);

    try {
      let offerProducts = [];

      await new Promise(async (resolve) => {
        while (!offerProducts.length) {
          try {
            this.logger.log("Fetching from Lightning Offers Page...".cyan);
            offerProducts = await getLightningOffers();
          } catch (err) {
            console.error(err);
            this.logger.log(
              `Unable to fetch lightning offers page. Retrying in ${Number(
                RETRY_WAIT / 1000
              )} second(s)...`.red,
              ERROR
            );
            await new Promise((resolve) => setTimeout(resolve, RETRY_WAIT));
          }
        }
        resolve();
      });

      // const productsData = [];

      // while (!productsData.length) {
      //   this.logger.log(
      //     `Getting product details for ${valueDealsLinks.length} product link(s) scraped...`
      //       .cyan
      //   );

      //   for (let productLink of valueDealsLinks) {
      //     this.logger.log(`Fetching data for: ${productLink}`.gray);

      //     try {
      //       const productData = await getDetailsFromURL(productLink);
      //       productsData.push(productData);

      //       this.logger.log(
      //         `[ ${productsData.length} ] Details fetched for ${productData.title.bold}`
      //           .green
      //       );

      //       // We only need a certain amount of products
      //       if (productsData.length == PRODUCTS_COUNT) {
      //         break;
      //       }
      //     } catch (err) {
      //       this.logger.log(
      //         `Error while fetching ${productLink}: ${err.message}`,
      //         "ERROR"
      //       );
      //     }
      //   }

      //   this.logger.log(
      //     `Total of ${productsData.length} products has been fetched.`
      //   );

      //   if (!productsData.length) {
      //     this.logger.log(
      //       `No products fetched. Retring in ${Number(
      //         RETRY_WAIT / 1000
      //       )} second(s)...`.magenta
      //     );
      //     await new Promise((resolve) => setTimeout(resolve, RETRY_WAIT));
      //   }
      // }

      // // Remove old products
      // this.logger.log("Removing old products...".green);
      // const deletedProducts = await strapi.services.product.delete({ deal_type: "aliexpress_value_deals" });
      // this.logger.log(`Deleted ${deletedProducts.length} product(s).`.cyan);

      // // Save new products
      // this.logger.log("Saving new products...".green);
      // for (const productData of productsData) {
      //   const newData = {
      //     website_tab: "home",
      //     deal_type: "aliexpress_value_deals",
      //     title: productData.title,
      //     image: productData.image,
      //     url_list: [
      //       {
      //         url: productData.affiliateLink,
      //         source: aliexpressSource.id,
      //         region: germanRegion.id,
      //         price: productData.price,
      //       },
      //     ],
      //   };

      //   this.logger.log(`Successfully saved: ${newData.title.bold}`.green);

      //   await strapi.services.product.create(newData);
      // }

      this.logger.log(" DONE ".bgGreen.white.bold);
      this.switch.stop();
    } catch (err) {
      console.error(err, err.data);
      this.switch.stop();
    }
  }
}

AmazonLightningOffsers.backgroundProcessName = "AliExpress Value Deals";

// Initialize Background Process
const amazonLightningOffsers = new AmazonLightningOffsers(config);

module.exports = amazonLightningOffsers;
