const browser = require("../browser");
const path = require("path");
const scrapeAmazonProduct = require("./scrapeAmazonProduct");
const amazonLink = require("./amazonLink");

const createStrapiInstance = require("../../scripts/strapi-custom");

const LIGHTNING_OFFERS_PAGE =
  "https://www.amazon.de/-/en/gp/angebote?ref_=nav_cs_gb_c869dbce88784497bfc3906e5456094e&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A0%252C%2522presetId%2522%253A%2522deals-collection-lightning-deals%2522%252C%2522dealType%2522%253A%2522LIGHTNING_DEAL%2522%252C%2522sorting%2522%253A%2522BY_SCORE%2522%257D";

const GERMAN_ZIP_CODE = 74074;
const ZIP_CHANGE_POPOVER_BUTTON = "#nav-global-location-popover-link";
const ZIP_INPUT_SECTION = "#GLUXZipInputSection";
const ZIP_INPUT_INPUT = `#GLUXZipUpdateInput`;
const ZIP_INPUT_APPLY = `#GLUXZipUpdate input[type="submit"]`;
const PRODUCT_CARD = '[class^="DealGridItem-module__dealItem_"]';
const ADDRESS_CHANGE_URL =
  "https://www.amazon.de/gp/delivery/ajax/address-change.html";

const getLightningOffers = async () => {
  const strapi = await createStrapiInstance();

  try {
    await browser.setViewport({
      width: 1440,
      height: 900,
    });

    console.log("Getting to Lightning Offers Page...");
    await browser.goTo(LIGHTNING_OFFERS_PAGE);
    await browser.waitForSelector(ZIP_CHANGE_POPOVER_BUTTON);

    console.log("Applying zip code...");

    // Click to show popover
    await browser.click(ZIP_CHANGE_POPOVER_BUTTON);
    await browser.waitForSelector(ZIP_INPUT_SECTION);

    // Apply zip update
    await browser.$eval(
      ZIP_INPUT_INPUT,
      (el, zipCode) => (el.value = zipCode),
      GERMAN_ZIP_CODE
    );

    let zipApplied = false;

    while (!zipApplied) {
      try {
        await Promise.all([
          browser.click(ZIP_INPUT_APPLY),
          // Wait for address change response
          browser.waitForResponse(ADDRESS_CHANGE_URL, { timeout: 10000 }),
        ]);
        zipApplied = true;
      } catch (err) {
        console.log(err.message.red);
        console.log(`Unable to apply zip change. Retrying...`.bold);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Reloading page to apply new address");
    await browser.reload();

    // Wait for the grid
    await browser.waitForSelector(PRODUCT_CARD);

    // Get productLinks
    const productLinks = await browser.$$eval(PRODUCT_CARD, (elements) =>
      [...elements]
        .slice(0, 50)
        .map((card) => {
          const cardLink = card.querySelector(".a-link-normal");
          return cardLink ? cardLink.href : null;
        })
    );

    console.log(
      `Scraping details for ${productLinks.length} products...`.green
    );

    let scrapedProducts = 0;
    for (const productLink of productLinks) {
      const productData = await scrapeAmazonProduct(productLink, "de", false);

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

      const newProduct = await strapi.query('product').create(productData);
      console.log(
        `[ ${++scrapedProducts} of 20 ] Saved new product: ${
          newProduct.title.bold
        }`.green
      );

      if (scrapedProducts === 20) {
        break;
      }
    }

    console.log(" DONE ".yellow.bgGreen);
  } catch (err) {
    console.error(err.message.red, err.stack);
    await page.screenshot({
      path: path.resolve(__dirname, "test.png"),
    });
  }
};

(async () => {
  await getLightningOffers();
  process.exit();
})();

module.exports = getLightningOffers;
