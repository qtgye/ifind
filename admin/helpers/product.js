/**
  Use puppeteer to get the HTML contents of a page
  Use JSDOM to scrape the HTML for needed data

  TODO:
  Create separate services for amazon and ebay
 */
const { isAmazonLink } = require('./url');
const { scrapeAmazonProduct, amazonLink } = require('./amazon');
const { getDetailsFromURL, ebayLink,  } = require('./ebay');

const getProductDetails = async (productData, language, scrapePriceOnly = false) => {
  const productURL = productData.amazon_url;
  const scrapedData = {};

  if ( !productURL ) {
    return null;
  }

  await Promise.all([

    // Scrape amazon
    (async() => {
      const scrapedDetails = await scrapeAmazonProduct(productURL, 'de', scrapePriceOnly);
      Object.entries(scrapedDetails).forEach(([ key, value ]) => {
        scrapedData[key] = value;
      });

      // Apply amazon affiliate link
      scrapedData.amazon_url = amazonLink(productData.amazon_url);
    })(),

    // Scrape other sites data
    (async () => {
      if ( !productData || !productData.url_list || !productData.url_list.length ) {
        return;
      }

      const [
        ebaySource,
        aliExpressSource,
      ] = await Promise.all([
        strapi.services.source.findOne({ name_contains: 'ebay' }),
        strapi.services.source.findOne({ name_contains: 'ali' }),
      ]);

      scrapedData.url_list = await Promise.all(productData.url_list.map(async urlData => {
        // Scrapte EBAY details
        if ( Number(urlData.source) == Number(ebaySource.id) && urlData.url ) {
          const ebayProductDetails = await getDetailsFromURL(urlData.url);
          if ( ebayProductDetails ) {
            urlData.price = ebayProductDetails.price || urlData.price || '';
            urlData.url = ebayLink(urlData.url);
          }
        }
        // Scrape ALIEXPRESS details
        else if ( Number(urlData.source) == Number(aliExpressSource.id) && urlData.url ) {
          // Scrape data here
        }

        return urlData;
      }));
    })(),

  ]);

  console.log('Contents queried.');

  return scrapedData;
}

/**
 * Fetches product details using google puppeteer
 * @param {ID} productID -  The product data matching Product type
 * @returns Object
 */
const fetchProductDetails = async (productID, language = 'en') => {
  if ( !productID ) return null;

  const product = await strapi.services.product.findOne({ id: productID });

  if ( !product ) return null;

  const amazonURL = product.amazon_url;

  if ( !amazonURL ) return null;

  const productDetails = await getProductDetails(product, language);

  return {
    ...productDetails,
    id: productID,
  };
}

const filterProductsWithProblems = (products) => {
  return products.filter(product => {
    const productChanges = product.product_changes || [];

    // Check amazon_url
    if (
      !isAmazonLink(product.amazon_url)
      && productChanges.some(({ state }) => state && isAmazonLink(state.amazon_url))
    ) {
      return true;
    }

    // Check url_list
    // Check if url_list is provided before but was removed unknowingly
    if (
      (!product.url_list || !product.url_list.length)
      && productChanges.some(({ state }) => state && state.url_list && state.url_list.length)
    ) {
      return true;
    }
  });
}


module.exports = {
  fetchProductDetails,
  getProductDetails,
  filterProductsWithProblems,
};
