const adminStrapi = require("../../../scripts/strapi-custom");
const { getValueDeals } = require("../../../helpers/aliexpress/value-deals");
const { getDetailsFromURL } = require("../../../helpers/aliexpress/api");
const axios = require('axios').default;


const RETRY_WAIT = 30000;

(async () => {
  const strapi = await adminStrapi();


  try {
    await axios.post("http://164.90.181.113:3000/aliexpress/getAliExpressData").then(
      (response) => {
        productsData = response.data.data;
        // offers.push(response.data)
      },
      (error) => {
        console.log(error);
      }
    );

    // Remove old products
    console.log("Removing old products...".green);


    // Save new products
    console.log("Saving new products...".green);

    let saved = 0;


    console.log(" DONE ".bgGreen.white.bold);
    process.exit();
  } catch (err) {
    console.error(err, err.data);
    throw err;
  }
})();
