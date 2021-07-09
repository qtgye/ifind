/**
 * Use puppeteer to get the HTML contents of a page
 * Use JSDOM to scrape the HTML for needed data
 */
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('./url');
const TIMEOUT = 60000;

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetails = async (productURL, language) => {
  if ( !productURL ) {
    return null;
  }

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  const browser = await startBrowser();
  const detailPage = await browser.newPage();

  const productSectionSelector = '#dp-container';

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
  const priceSelector = '#priceblock_ourprice';
  const imageSelector = '#landingImage[data-old-hires]';
  const titleSelector = '#productTitle';

  await detailPage.goto(urlWithLanguage, { timeout: TIMEOUT })
        .then(() => detailPage.waitForSelector(productSectionSelector, { timeout: TIMEOUT }));

  const detailPageHTML = await detailPage.$eval(productSectionSelector, detailContents => detailContents.outerHTML);

  await browser.close();
  console.log('Page parsed');

  const dom = new JSDOM(detailPageHTML);
  const titleElement = dom.window.document.querySelector(titleSelector);
  const priceElement = dom.window.document.querySelector(priceSelector);
  const imageElement = dom.window.document.querySelector(imageSelector);
  const detailElement = dom.window.document.querySelector(detailSelector);

  const title = titleElement && titleElement.textContent.trim();
  let price = priceElement && priceElement.textContent.match(/[1-9.,]+/);
      price = price && price[0] || 0;
  const image = imageElement && imageElement.getAttribute('data-old-hires');

  const allSelectorsToRemove = selectorsToRemove.join(',');
  [...detailElement.querySelectorAll(allSelectorsToRemove)].forEach(element => {
    try {
      element.remove();
    }
    catch (err) { /**/ }
  });
  const details_html = detailElement.outerHTML;

  console.log('Contents queried.');

  return {
    details_html,
    price,
    title,
    image,
  };
}

const extractDetailsFromPage = async (page, detailSelector, selectorsToRemove, titleSelector, priceSelector, imageSelector) => {
  const $detail = await page.$(detailSelector);
  const $image = await page.$(imageSelector);
  const $title = await page.$(titleSelector);
  const $price = await page.$(priceSelector);

  return await Promise.all([
    $detail.evaluate((detail, selectorsToRemove) => {
      const allSelectorsToRemove = selectorsToRemove.join(',');
      [...detail.querySelectorAll(allSelectorsToRemove)].forEach(element => {
        try {
          element.remove();
        }
        catch (err) { /**/ }
      });

      return detail.outerHTML;
    }, selectorsToRemove),
    $image.evaluate((imgElement) => imgElement && imgElement.getAttribute('data-old-hires')),
    $title.evaluate((titleElement) => titleElement && titleElement.textContent.trim()),
    $price.evaluate((priceElement) => {
      const price = priceElement && priceElement.textContent.match(/[1-9.,]+/);
      return price && price[0] || 0;
    }),
  ]);
};

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

  const productDetails = await getProductDetails(amazonURL, language);
  return {
    ...productDetails,
    id: productID,
  };
}


module.exports = {
  fetchProductDetails,
  getProductDetails,
};
