const createStrapiInstance = require("../../../scripts/strapi-custom");
const { default: axios } = require("axios");


(async () => {

  try {
    let scrapedProducts = null
    await axios.post("http://164.90.181.113:3000/amazon/getAmazonProducts").then(
      (response) => {
        scrapedProducts = response.data;
      },
      (error) => {
        console.log(error);
      }
    );

    // Remove old products
    console.log("Removing old products...".green);

    console.info(`Saving scraped products...`.bold);

    console.log(" DONE ".bgGreen.white.bold);
    productScraper.close();
    process.exit();
  } catch (err) {
    console.error(err.message);
    productScraper.close();
    throw err;
  }
})();
