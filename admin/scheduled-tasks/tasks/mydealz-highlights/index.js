const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { addURLParams, removeURLParams } = require("../../../helpers/url");
const createAmazonScraper = require("../../../helpers/amazon/amazonProductScraper");
const { getDetailsFromURL } = require("../../../helpers/ebay/api");
const createStrapiInstance = require("../../../scripts/strapi-custom");

const MYDEALZ_URL = "https://www.mydealz.de";
const MAX_PRODUCTS = 20;

const PRODUCT_CARD_SELECTOR = ".cept-thread-item";
const PRODUCT_MERCHANT_SELECTOR = ".cept-merchant-name";
const PRODUCT_DEAL_LINK_SELECTOR = ".cept-dealBtn";

const MERCHANTS_NAME_PATTERN = {
  amazon: /^amazon$/i,
  ebay: /^ebay$/i,
};

const getProductDetails = async (productSummaries) => {
  const scrapedProducts = [];

  for (let productSummary of productSummaries) {
    const { merchantName, productLink } = productSummary;

    try {
      switch (merchantName) {
        case "amazon":
          const amazonScraper = await createAmazonScraper();
          scrapedProducts.push(await amazonScraper.scrapeProduct(productLink));
          break;

        case "ebay":
          scrapedProducts.push(await getDetailsFromURL(productLink));
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(`Error while scraping ${productLink.bold}`);
      console.error(err);
    }
  }

  return scrapedProducts;
};

(async () => {
  const merchantNamesKeys = Object.keys(MERCHANTS_NAME_PATTERN);
  const merchantNamesRegExplist = Object.values(MERCHANTS_NAME_PATTERN);

  try {
    const scrapedProducts = [];
    // Cache product links to check for duplicate products
    const productLinks = [];
    let page = 1;
    let morePageAvailable = true;

    while (scrapedProducts.length < MAX_PRODUCTS && morePageAvailable) {
      const fetchedProducts = [];

      console.info(`Getting to mydealz page ${page}`.cyan);
      const response = await fetch(addURLParams(MYDEALZ_URL, { page }));
      const bodyHtml = await response.text();
      const {
        window: { document },
      } = new JSDOM(bodyHtml);

      console.info("Getting product links".cyan);
      const products = Array.from(
        document.querySelectorAll(PRODUCT_CARD_SELECTOR)
      );

      // Select only products from selected merchants
      const filteredProducts = products.filter((productElement) => {
        const merchantNameElement = productElement.querySelector(
          PRODUCT_MERCHANT_SELECTOR
        );
        const merchantName = merchantNameElement
          ? merchantNameElement.textContent.trim()
          : "";
        return merchantNamesRegExplist.some((matcher) =>
          matcher.test(merchantName)
        );
      });

      for (productElement of filteredProducts) {
        const merchantNameText = productElement
          .querySelector(PRODUCT_MERCHANT_SELECTOR)
          .textContent.trim();
        const merchantName = merchantNamesKeys.filter((merchantNameKey) =>
          MERCHANTS_NAME_PATTERN[merchantNameKey].test(merchantNameText)
        )[0];
        const dealLink = productElement
          .querySelector(PRODUCT_DEAL_LINK_SELECTOR)
          .getAttribute("href");
        const productLink = removeURLParams((await fetch(dealLink)).url);

        // If a product link is already present,
        // that means we reached the end of the pagination
        // and no more products available
        if (productLinks.includes(productLink)) {
          morePageAvailable = false;
          break;
        }

        productLinks.push(productLink);

        fetchedProducts.push({
          merchantName,
          productLink,
        });
      }

      console.info(
        `Getting details for ${fetchedProducts.length} product(s)`.cyan
      );

      const productDetails = await getProductDetails(fetchedProducts);

      scrapedProducts.push(...productDetails);

      page++;
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
