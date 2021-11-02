const createStrapiInstance = require("../../../scripts/strapi-custom");
const getLightningOffers = require("../../../helpers/amazon/lightning-offers");
const scrapeAmazonProduct = require("../../../helpers/amazon/scrapeAmazonProduct");
const amazonLink = require("../../../helpers/amazon/amazonLink");

(async () => {
  try {
    let offerProducts = [];

    await new Promise(async (resolve) => {
      while (!offerProducts.length) {
        try {
          console.log("Fetching from Lightning Offers Page...".cyan);
          offerProducts = await getLightningOffers();
        } catch (err) {
          console.error(err);
          console.error(
            `Unable to fetch lightning offers page. Retrying in ${Number(
              RETRY_WAIT / 1000
            )} second(s)...`.red
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_WAIT));
        }
      }
      resolve();
    });

    if (offerProducts.length) {
      const strapi = await createStrapiInstance();

      // Remove old products
      console.log("Removing old products...".green);
      const deletedProducts = await strapi.services.product.delete({
        deal_type: "aliexpress_value_deals",
      });
      console.log(`Deleted ${deletedProducts.length} product(s).`.cyan);

      console.log(
        `Scraping details for ${offerProducts.length} products...`.green
      );

      let scrapedProducts = 0;
      for (const productLink of offerProducts) {
        try {
          console.log(`Scraping: ${productLink}`);
          const productData = await scrapeAmazonProduct(
            productLink,
            "de",
            false
          );

          if (!productData || !productData.title || !productData.price) {
            continue;
          }

          // Additional props
          productData.release_date = productData.releaseDate;
          productData.amazon_url = amazonLink(productLink);
          productData.deal_type = "amazon_flash_offers";
          productData.website_tab = "home";

          // Preprocess data props
          productData.updateScope = {
            amazonDetails: false,
            price: false,
          };

          // Remove unnecessary props
          delete productData.releaseDate;

          // Save product
          const newProduct = await strapi.query("product").create(productData);
          console.log(
            `[ ${++scrapedProducts} of 20 ] Saved new product: ${
              newProduct.title.bold
            }`.green
          );

          if (scrapedProducts === 20) {
            break;
          }
        } catch (err) {
          console.error(err);
          continue;
        }
      }
    }

    console.log(" DONE ".bgGreen.white.bold);
  } catch (err) {
    console.error(err, err.data);
  }

  process.exit();
})();
