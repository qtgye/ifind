/**
  Use puppeteer to get the HTML contents of a page
  Use JSDOM to scrape the HTML for needed data

  TODO:
  Create separate services for amazon and ebay
 */
const fetch = require('node-fetch');
const { isAmazonLink } = require('./url');
const { scrapeAmazonProduct } = require('./scrapeAmazonProduct');

const EBAY_GETITEM_ENDPOINT = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KirillKr-ifindilu-PRD-9afbfbe27-8527205b&siteid=0&version=967&IncludeSelector=Details&ItemID=';

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
    })(),

    // Scrape ebay price
    (async () => {
      const ebaySource = await strapi.services.source.findOne({
        name_contains: 'ebay'
      });

      if ( !ebaySource ) {
        return;
      }

      if ( !productData || !productData.url_list || !productData.url_list.length ) {
        return;
      }

      scrapedData.url_list = await Promise.all(productData.url_list.map(async urlData => {
        if ( Number(urlData.source) !== Number(ebaySource.id) || !urlData.url ) {
          return urlData;
        }

        // Extract ebay itemID
        const [ itemID ] = urlData.url.match(/[0-9]{9,12}/g) || [];

        if ( itemID ) {
          const res = await fetch(EBAY_GETITEM_ENDPOINT + itemID);
          const { Item } = await res.json();

          if ( Item && Item.CurrentPrice && Item.CurrentPrice.Value ) {
            urlData.price = Item.CurrentPrice.Value;
          }
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
