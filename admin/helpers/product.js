const puppeteer = require('puppeteer');
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
  const pricePage = await browser.newPage();

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

  await Promise.all([
    detailPage.goto(urlWithLanguage, { timeout: TIMEOUT })
      .then(() => detailPage.waitForSelector(detailSelector, { timeout: TIMEOUT })),
    pricePage.goto(englishPageURL, { timeout: TIMEOUT })
      .then(() => pricePage.waitForSelector(priceSelector, { timeout: TIMEOUT })),
  ]);

  const [
    title,
    details_html,
    price,
    image,
  ] = await Promise.all([
    extractTitleFromPage(detailPage, titleSelector),
    extractDetailHTMLFromPage(detailPage, detailSelector, selectorsToRemove),
    extractPriceFromPage(pricePage, priceSelector),
    extractImageFromPage(detailPage, imageSelector),
  ]);

  await browser.close();

  return {
    details_html,
    price,
    image,
    title
  };
}

const extractDetailHTMLFromPage = async (page, selector, selectorsToRemove) => (
  page.$eval(selector, (detail, selectorsToRemove) => {
    const allSelectorsToRemove = selectorsToRemove.join(',');

    [...detail.querySelectorAll(allSelectorsToRemove)].forEach(element => {
      try {
        element.remove();
      }
      catch (err) { /**/ }
    });

    return detail.outerHTML;
  }, selectorsToRemove)
);

const extractPriceFromPage = async (page, selector) => (
  page.$eval(selector, (priceElement) => {
    const price = priceElement && priceElement.textContent.match(/[1-9.,]+/);
    return price && price[0] || 0;
  })
)

const extractImageFromPage = async (page, selector) => (
  page.$eval(selector, (imgElement) => {
    const image = imgElement && imgElement.getAttribute('data-old-hires');
    return image;
  })
);

const extractTitleFromPage = async (page, selector) => (
  page.$eval(selector, (titleElement) => {
    const title = titleElement && titleElement.textContent;
    return title;
  })
)

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
