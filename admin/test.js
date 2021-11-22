/**
 * PREREQUISITE:
 * - Tor service configured as proxy server (source: https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc)
 * - Tor config set to german country (source: https://ab-kotecha.medium.com/how-to-connect-from-a-specific-country-without-any-vpn-but-privately-enough-through-tor-browser-5dc2d45043b)
 */
require("colors");
const {
  existsSync,
  readFileSync,
  ensureDirSync,
  rmdirSync,
} = require("fs-extra");
const { TORRC_PATH } = require("dotenv").config().parsed;
const path = require("path");
const puppeteer = require("puppeteer");
const { addURLParams } = require("./helpers/url");
const applyGermanLocation = require('./helpers/amazon/applyGermanLocation');

if (!TORRC_PATH || !existsSync(TORRC_PATH)) {
  throw new Error(
    `Tor config file path is not given. Please provide TORRC_PATH in env file.`
  );
}

const portsConfig = readFileSync(TORRC_PATH)
  .toString()
  .match(/socksport\s+\d+/gi);
const availablePorts = portsConfig
  .map((portConfig) => portConfig.split(/\s+/)[1])
  .filter(Boolean);

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

const getBrowserPage = async (proxy = `--proxy-server=socks5://127.0.0.1:9050`) => {
  const browser = await puppeteer.launch({
    args: [proxy, '--no-sandbox'].filter(Boolean),
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 3000,
  });

  return page;
};

(async () => {
  const usedPorts = [];

  // Clear screenshorts root
  try {
    rmdirSync(SCREENSHOTS_ROOT, {
      recursive: true,
    });
  } catch (err) {
    console.error(err);
  }

  ensureDirSync(SCREENSHOTS_ROOT);

  // Get products list
  console.log("Getting products list...");
  let page = await getBrowserPage();
  await page.goto(LIGHTNING_OFFERS_PAGE, {
    timeout: 60000 * 3,
  });
  await page.waitForSelector(PRODUCT_CARD);
  const urls = await page.evaluate((PRODUCT_CARD) => {
    const productCards = Array.from(document.querySelectorAll(PRODUCT_CARD));
    return productCards
      .map((card) => {
        const cardLink = card.querySelector(".a-link-normal");
        return cardLink ? cardLink.href : null;
      })
      .filter((url) => /amazon\.[a-z]+\/[^\/]{10,}\//.test(url));
  }, PRODUCT_CARD);

  await page.screenshot({
    path: path.resolve(SCREENSHOTS_ROOT, 'test.png'),
  });

  console.log(`Got a list of ${urls.length} products.`);

  while (usedPorts.length < 30 && usedPorts.length < urls.length) {
    let port;

    while (!port || usedPorts.includes(port)) {
      const randomIndex = Math.round(
        Math.random() * (availablePorts.length - 1)
      );
      port = availablePorts[randomIndex];
    }

    console.log(`Using port: ${port}`);
    usedPorts.push(port);

    const page = await getBrowserPage(
      `--proxy-server=socks5://127.0.0.1:${port}`
    );

    // Go to page
    console.log("Going to product page...");
    const url = urls[usedPorts.length - 1];
    const urlEnglish = addURLParams(url, { language: "en" });
    console.log(urlEnglish.cyan);
    await page.goto(urlEnglish, {
      timeout: 60000 * 3,
    });

    // Apply german zip code
<<<<<<< HEAD
    const _page = await applyGermanLocation(page);

    const hasPriceElement = await _page.evaluate((PRICE_SELECTOR) => document.querySelector(PRICE_SELECTOR) ? true : false, PRICE_SELECTOR);
=======
    await applyGermanLocation(page);

    const hasPriceElement = await page.evaluate((PRICE_SELECTOR) => document.querySelector(PRICE_SELECTOR) ? true : false, PRICE_SELECTOR);
>>>>>>> ed36d265a4b96d2bac568c9d04cf97c0ddd70f32

    if ( !hasPriceElement ) {
      console.log('Page might have error'.magenta);
    }

    console.log("Saving Screenshot");
    const screenShortDir = path.resolve(
      SCREENSHOTS_ROOT,
      url.replace("https://www.amazon.de/", "")
    );
    ensureDirSync(screenShortDir);

    // Remove cookie banner
    await _page.evaluate(() => {
      const cookieBanner = document.querySelector('#sp-cc');
      if ( cookieBanner ) {
        cookieBanner.remove();
      }
    });

    // Save screenshot
    await _page.screenshot({
      path: path.resolve(screenShortDir, "index.png"),
    });

    (await _page.browser()).close();
  }

  console.log("DONE".bold.green);
})();
