const puppeteer = require('puppeteer');

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetail = async (productDetailURL) => {
  console.log({ productDetailURL });
  if ( !productDetailURL ) {
    return null;
  }

  const browser = await startBrowser();
  const page = await browser.newPage();
  const detailSelector = '#centerCol';

  await page.goto(productDetailURL);
  await page.waitForSelector(detailSelector);
  const detailHTML = await page.$eval(detailSelector, detail => detail.textContent);

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
  const [
    amazonSource,
    product,
  ] = await Promise.all([
    await strapi.services.source.findOne({ name_contains: "Amazon" }),
    await strapi.services.product.findOne({ id: productID }),
  ]);

  if ( !productID ) return null;

  // Extract default URL
  const defaultURL = product.url_list.find(({ is_base, source }) => (
                        is_base && source.id === amazonSource.id
                      ))
                    || product.url_list.find(({ source }) => source.id === amazonSource.id);

  if ( !defaultURL ) return null;

  const urlWithLanguage = addURLParams(defaultURL.url, { language });
  console.log({ urlWithLanguage });
  const productDetails = await getProductDetail(urlWithLanguage);
  return productDetails;
}


module.exports = {
  fetchProductDetails,
};
