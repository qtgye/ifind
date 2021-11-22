require("colors");
const { ensureDirSync, rmdirSync } = require("fs-extra");
const path = require("path");

const { addURLParams } = require("./helpers/url");
const createTorProxy = require("./helpers/tor-proxy");

const LIGHTNING_OFFERS_PAGE =
  "https://www.amazon.de/-/en/gp/angebote?ref_=nav_cs_gb_c869dbce88784497bfc3906e5456094e&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A0%252C%2522presetId%2522%253A%2522deals-collection-lightning-deals%2522%252C%2522dealType%2522%253A%2522LIGHTNING_DEAL%2522%252C%2522sorting%2522%253A%2522BY_SCORE%2522%257D";
const PRODUCT_CARD = '[class^="DealGridItem-module__dealItem_"]';
const SCREENSHOTS_ROOT = path.resolve(
  __dirname,
  "helpers/amazon/page-errors/_test"
);
const PRICE_SELECTOR = [
  "#dealsAccordionRow .a-color-price",
  "#apex_offerDisplay_desktop .a-text-price .a-offscreen",
  "#corePrice_desktop .a-price",
  "#corePrice_feature_div .a-text-price",
  "#price_inside_buybox",
  "#priceblock_dealprice",
  "#priceblock_ourprice",
  '[data-action="show-all-offers-display"] .a-color-price',
  "#usedOnlyBuybox .offer-price",
  "#olp_feature_div .a-color-price",
].join(",");

(async () => {
  const torProxy = createTorProxy();

  // Clear screenshots root
  try {
    rmdirSync(SCREENSHOTS_ROOT, {
      recursive: true,
    });
  } catch (err) {
    console.error(err);
  }

  ensureDirSync(SCREENSHOTS_ROOT);

  // Get products list
  console.info("Getting products list...");
  let proxiedPage = await torProxy.newPage();
  await proxiedPage.goto(LIGHTNING_OFFERS_PAGE, {
    timeout: 60000 * 3,
  });
  await proxiedPage.waitForSelector(PRODUCT_CARD);
  const urls = await proxiedPage.evaluate((PRODUCT_CARD) => {
    const productCards = Array.from(document.querySelectorAll(PRODUCT_CARD));
    return productCards
      .map((card) => {
        const cardLink = card.querySelector(".a-link-normal");
        return cardLink ? cardLink.href : null;
      })
      .filter((url) => /amazon\.[a-z]+\/[^\/]{10,}\//.test(url));
  }, PRODUCT_CARD);

  await proxiedPage.screenshot({
    path: path.resolve(SCREENSHOTS_ROOT, "index.png"),
  });

  console.info(`Got a list of ${urls.length} products.`);

  let products = 0;
  let urlIndex = 0;
  while (products < 30) {
    const timeStart = Date.now();

    // Go to page
    console.info(`\n[ ${String(products + 1).bold} ] Going to product page...`);
    const url = urls[urlIndex++];
    const urlEnglish = addURLParams(url, { language: "en" });
    console.info(urlEnglish.cyan);

    try {
      let hasPriceElement = false;
      let tries = 1;

      while (!hasPriceElement && tries <= 3) {
        try {
          proxiedPage = await torProxy.newPage();
          await proxiedPage.goto(urlEnglish, {
            timeout: 60000 * 3,
          });
          await proxiedPage.waitForSelector(PRICE_SELECTOR);
          hasPriceElement = true;
        } catch (err) {
          console.info(err.message.magenta);
          console.info("Retrying...".yellow);
          if (tries <= 3) {
            await torProxy.launchNewBrowser();
            proxiedPage = await torProxy.newPage();
          }
          tries++;
        }
      }

      if (!hasPriceElement) {
        throw new Error("Page might have error");
      }
    } catch (err) {
      console.error(err.message.magenta);
    }

    console.info("Saving Screenshot");
    const screenShortDir = path.resolve(
      SCREENSHOTS_ROOT,
      url.replace("https://www.amazon.de/", "")
    );
    ensureDirSync(screenShortDir);

    // Remove cookie banner
    await proxiedPage.evaluate(() => {
      const cookieBanner = document.querySelector("#sp-cc");
      if (cookieBanner) {
        cookieBanner.remove();
      }
    });

    // Save screenshot
    await proxiedPage.screenshot({
      path: path.resolve(screenShortDir, "index.png"),
    });

    products++;

    const timeEnd = Date.now();
    console.info(
      `Time spent: ${Number(
        ((timeEnd - timeStart) / 1000).toFixed(2)
      )} seconds.`.italic.bold
    );
  }

  console.info("DONE".bold.green);

  process.exit();
})();
