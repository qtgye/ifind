const path = require("path");
const browser = require("../browser");
const applyGermanLocation = require('./applyGermanLocation');

const LIGHTNING_OFFERS_PAGE =
  "https://www.amazon.de/-/en/gp/angebote?ref_=nav_cs_gb_c869dbce88784497bfc3906e5456094e&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A0%252C%2522presetId%2522%253A%2522deals-collection-lightning-deals%2522%252C%2522dealType%2522%253A%2522LIGHTNING_DEAL%2522%252C%2522sorting%2522%253A%2522BY_SCORE%2522%257D";

const PRODUCT_CARD = '[class^="DealGridItem-module__dealItem_"]';

const getLightningOffers = async () => {
  try {
    console.log("Getting to Lightning Offers Page...");
    await browser.goTo(LIGHTNING_OFFERS_PAGE);

    // Apply german location
    await applyGermanLocation(browser);

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

    return productLinks;
  } catch (err) {
    console.error(err.message.red, err.stack);
    await page.screenshot({
      path: path.resolve(__dirname, "test.png"),
    });

    return [];
  }
};

module.exports = getLightningOffers;
