const createStrapiInstance = require("../../../scripts/strapi-custom");
const getEbayWowOffers = require("../../../helpers/ebay/wow-offers");
const ebayLink = require("../../../helpers/ebay/ebayLink");
const { NULL } = require("node-sass");
const axios = require('axios').default;


const EBAY_DEAL_TYPE = "ebay_wow_offers";

(async () => {
  try {
    console.log("Getting Ebay Wow Offers...");
    // const offers = await getEbayWowOffers();
    let offers = null
    await axios.post("http://164.90.181.113:3000/ebay/fetchEbayStore").then(
      (response) => {
        offers = response.data.data;
        // offers.push(response.data)
      },
      (error) => {
        console.log(error);
      }
    );

    console.log(`Deleted  product(s).`.cyan);

    console.log("Saving new products...");
    let savedProducts = 0;

    console.log(" DONE ".bgGreen.white.bold);
    process.exit();
  } catch (err) {
    console.error(err, err.data);
    process.exit();
  }
})();
