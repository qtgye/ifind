/**
  Use puppeteer to get the HTML contents of a page
  Use JSDOM to scrape the HTML for needed data

  TODO:
  Create separate services for amazon and ebay
 */
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const moment = require('moment');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('./url');

const EBAY_GETITEM_ENDPOINT = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KirillKr-ifindilu-PRD-9afbfbe27-8527205b&siteid=0&version=967&IncludeSelector=Details&ItemID=';
const TIMEOUT = 60000;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetails = async (productData, language, scrapePriceOnly = false) => {
  const productURL = productData.amazon_url;

  if ( !productURL ) {
    return null;
  }

  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  const browser = await startBrowser();

  const productSectionSelector = '#dp-container';

  await Promise.all([

    // Scrape amazon
    (async () => {
      const detailPage = await browser.newPage();
      const priceSelector = '#priceblock_ourprice, [data-action="show-all-offers-display"] .a-color-price';
      const imageSelector = '#landingImage[data-a-dynamic-image]';
      const titleSelector = '#title';
      const additionalInfoTableSelector = '#productDetails_detailBullets_sections1';

      const detailSelector = '#centerCol';
      const selectorsToRemove = [
        '#title',
        '#desktop_unifiedPrice',
        '#productSupportAndReturnPolicy_feature_div',
        '#alternativeOfferEligibilityMessaging_feature_div',
        '#olp_feature_div',
        '#seeMoreDetailsLink',
        '#HLCXComparisonJumplink_feature_div',
        '.caretnext',
      ];

      // Scrape for all amazon details if applicable
      if ( !scrapePriceOnly ) {
        await detailPage.goto(urlWithLanguage, { timeout: TIMEOUT })
        await detailPage.waitForSelector(productSectionSelector, { timeout: 5000 });

        const detailPageHTML = await detailPage.$eval(productSectionSelector, detailContents => detailContents.outerHTML);

        console.log('Page parsed');

        const dom = new JSDOM(detailPageHTML);
        const titleElement = dom.window.document.querySelector(titleSelector);
        const imageElement = dom.window.document.querySelector(imageSelector);
        const detailElement = dom.window.document.querySelector(detailSelector);

        // Select highres image from dynamic image data
        const imageData = scrapedData.image = imageElement ? JSON.parse(imageElement.dataset.aDynamicImage) || {} : {};
        const highResImage = Object.entries(imageData).reduce((selectedEntry, [ url, dimensions ]) => (
          !selectedEntry ? [ url, dimensions ]
            : dimensions[0] > selectedEntry[1][0] ? [ url, dimensions ]
              : selectedEntry
        ), null);

        // Remove unnecessary elements from detail section
        const allSelectorsToRemove = selectorsToRemove.join(',');
        [...detailElement.querySelectorAll(allSelectorsToRemove)].forEach(element => {
          try {
            element.remove();
          }
          catch (err) { /**/ }
        });

        // Apply scraped details
        scrapedData.title = titleElement ? titleElement.textContent.trim() : '';
        scrapedData.image = highResImage ? highResImage[0] : '';
        scrapedData.details_html = detailElement.outerHTML.trim();
      }

      // Go to english site for price and release_date
      await detailPage.goto(englishPageURL, { timeout: TIMEOUT })
      await detailPage.waitForSelector(productSectionSelector, { timeout: TIMEOUT });
      const detailPageHTML = await detailPage.$eval(productSectionSelector, detailContents => detailContents.outerHTML);
      const dom = new JSDOM(detailPageHTML);

      // Get the price
      const priceElement = dom.window.document.querySelector(priceSelector);
      const priceMatch = priceElement && priceElement.textContent.match(/[0-9.,]+/);
      scrapedData.price = priceMatch && priceMatch[0].replace(',', '') || 0;

      // Get the release date if applicable
      if ( !scrapePriceOnly ) {
        const additionalInfoTable = dom.window.document.querySelector(additionalInfoTableSelector);
        const releaseDateRow = Array.from(additionalInfoTable.rows).find(row => (
          row.cells[0] && /date first available/i.test(row.cells[0].textContent)
        ));
        const releaseDateString = releaseDateRow.cells[1] ? releaseDateRow.cells[1].textContent.trim() : '';

        if ( !releaseDateString ) {
          return;
        }

        const [ day, monthAbbrev, year ] = releaseDateString.split(' ');
        const isoDate = [ year, MONTHS.indexOf(monthAbbrev.substr(0, 3)), day ];

        const releaseDateMoment = moment.utc(isoDate);
        const releaseDate = releaseDateMoment ? releaseDateMoment.toISOString() : '';

        if ( releaseDate ) {
          scrapedData.releaseDate = releaseDate;
        }
      }
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

  await browser.close();

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


module.exports = {
  fetchProductDetails,
  getProductDetails,
};
