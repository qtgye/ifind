const puppeteer = require('puppeteer');

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetail = async (productDetailURL) => {
  if ( !productDetailURL ) {
    return null;
  }

  const browser = await startBrowser();
  const page = await browser.newPage();
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

  await page.goto(productDetailURL);
  await page.waitForSelector(detailSelector);
  const detailHTML = await page.$eval(detailSelector, (detail, selectorsToRemove) => {
    const allSelectorsToRemove = selectorsToRemove.join(',');

    [...detail.querySelectorAll(allSelectorsToRemove)].forEach(element => {
      try {
        element.remove();
      }
      catch (err) { /**/ }
    });

    return detail.outerHTML;
  }, selectorsToRemove);

  await browser.close();

  return {
    detailURL: productDetailURL,
    detailHTML: detailHTML,
  };
}

const addURLParams = (url = '', paramsObject) => {
  const [ baseURL, searchParams ] = url.split('?');
  const searchParamsObject = searchParams.split('&').reduce((all, keyValue) => {
    const [ key, value ] = keyValue.split('=');
    all[key] = value;
    return all;
  }, {});
  const newParams = {
    ...searchParamsObject,
    ...paramsObject,
  };
  const newParamsString = Object.entries(newParams).map(([ key, value ]) => `${key}=${value}`).join('&');

  return baseURL + '?' + newParamsString;
}


/**
 * Fetches product details using google puppeteer
 * @param {ID} productID -  The product data matching Product type
 * @returns Object
 */
const fetchProductDetails = async (productID, language = 'en') => {
  if ( !productID ) return null;

  const [
    amazonSource,
    product,
  ] = await Promise.all([
    await strapi.services.source.findOne({ name_contains: "Amazon" }),
    await strapi.services.product.findOne({ id: productID }),
  ]);

  if ( !product ) return null;

  // Extract default URL
  const defaultURL = (product.url_list || []).find(({ is_base, source }) => (
                        is_base && source && amazonSource && source.id === amazonSource.id
                      ))
                    || product.url_list.find(({ source }) => (
                      source && amazonSource && source.id === amazonSource.id
                    ));

  if ( !defaultURL ) return null;

  const urlWithLanguage = addURLParams(defaultURL.url, { language });
  const productDetails = await getProductDetail(urlWithLanguage);
  return {
    ...productDetails,
    id: productID,
  };
}


module.exports = {
  fetchProductDetails,
};
