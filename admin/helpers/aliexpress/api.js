const ApiClient = require('./nodejs').ApiClient;
const { appKey, appSecret, tracking_id } = require('./config');

var client = new ApiClient({
                            'appkey': appKey,
                            'appsecret': appSecret,
                            'REST_URL':'http://gw.api.taobao.com/router/rest'
                            // 'REST_URL':'https://eco.taobao.com/router/rest',
                            });

const getDetailsFromURl = async (productURL) => {
  const productID = parseIdFromURL(productURL);

  if ( !productID ) {
    return null;
  }

  const [
    productDetailsResponse,
    affiliateLinkResponse,
  ] = await Promise.all([

    // Get Product details
    getProductDetails(productID),

    // Get affiliate link
    generateAffiliateLink(productURL),

  ]);

  const data = {};

  if (
    productDetailsResponse
    && productDetailsResponse.resp_result
    && productDetailsResponse.resp_result.resp_code == 200
    && productDetailsResponse.resp_result.result.current_record_count
  ) {
    data.price = productDetailsResponse.resp_result.result.products.product[0].target_app_sale_price;
    data.currency = productDetailsResponse.resp_result.result.products.product[0].target_app_sale_price_currency;
  } else {
    throw new Error(`Unable to get details for the AliExpress Link. The product link might be non-affiliate, please select another link.`);
  }

  if (
    affiliateLinkResponse
    && affiliateLinkResponse.resp_result
    && affiliateLinkResponse.resp_result.resp_code == 200
    && affiliateLinkResponse.resp_result.result.total_result_count
  ) {
    data.affiliateLink = affiliateLinkResponse.resp_result.result.promotion_links.promotion_link[0].promotion_link;
  } else {
    throw new Error(`Unable to get affiliate link for the AliExpress Link. The product link might be non-affiliate, please select another link.`);
  }

  return data;
}

const parseIdFromURL = (productURL) => {
  const [ baseURL ] = productURL.split('?');
  const [ productID ] = baseURL.match(/(?<=item\/)\d+/) || [];
  return productID || null;
}

const getProductDetails = async (productID, target_currency = 'EUR', country = 'DE') => {
  return sendAPIRequest(
    'aliexpress.affiliate.productdetail.get',
    {
      product_ids: productID,
      target_currency,
      country,
      tracking_id,
      format: 'json',
      symplify: true,
      fields: 'target_app_sale_price,target_app_sale_price_currency'
    }
  );
}

const generateAffiliateLink = async (productURL) => {
  return sendAPIRequest(
    'aliexpress.affiliate.link.generate',
    {
      source_values: productURL,
      promotion_link_type: 0,
      tracking_id,
    }
  );
}

const sendAPIRequest = async (method, parameters) => (
  new Promise((resolve, reject) => {
    client.execute(
      method,
      parameters,
      function (error,response) {
          if(!error)
            resolve(response);
          else
            reject(error);
      })
  })
)

module.exports = {
  getDetailsFromURl,
};


// LEAVING THE CODES BELOW FOR REFERENCE, IN CASE OF FUTURE NEEDS

// const productURL = `https://de.aliexpress.com/item/1005002252415927.html?spm=a2g0o.ams_97944.topranking.10.1bbcijbqijbqKX&pdp_ext_f=%7B%22ship_from%22:%22CN%22,%22sku_id%22:%2212000019658480465%22%7D&scm=1007.26694.226824.0&scm_id=1007.26694.226824.0&scm-url=1007.26694.226824.0&pvid=6674ea09-9a6b-4c74-bed3-745d58c90f89&fromRankId=1756859&_t=fromRankId:1756859`;
// // const productURL = `https://de.aliexpress.com/item/1005001506602881.html?spm=a2g0o.ams_97944.topranking.1.1bbcijbqijbqKX&pdp_ext_f=%7B%22ship_from%22:%22CN%22,%22sku_id%22:%2212000016389256218%22%7D&scm=1007.26694.226824.0&scm_id=1007.26694.226824.0&scm-url=1007.26694.226824.0&pvid=6674ea09-9a6b-4c74-bed3-745d58c90f89&fromRankId=1756859&_t=fromRankId:1756859`;

// fetch(productURL)
// .then(res => res.text())
// .then(html => {
//   const paramsScriptMatch = /(?<=window\.runParams[^{]+){([\s\S]|)+};/i.exec(html);
//   if ( paramsScriptMatch ) {
//     const [ json ] = paramsScriptMatch[0].split(/;\s/);
//     const { data } = eval(`(${json})`);
//     // console.log(JSON.stringify(data.commonModule, null, '  '));
//     const skuId = data.skuModule.skuPriceList[0].skuId;
//     const productId = data.commonModule.productId;
//     const userCountryCode = data.commonModule.userCountryCode;
//     const currencyCode = data.commonModule.currencyCode;
//     const tradeCurrencyCode = data.commonModule.tradeCurrencyCode;
//     console.log({ skuId, productId });
//     return Object.entries({
//       skuId,
//       productId,
//       // userCountryCode: 'DE',
//       // currencyCode: currencyCode,
//       // tradeCurrencyCode: tradeCurrencyCode,
//       currency: 'EUR',
//     }).reduce((paramsList, keyValue) => (
//       paramsList.concat(keyValue.join('='))
//     ), []).join('&');
//   }
// })
// .then(searchParams => {
//   const url = [ `https://de.aliexpress.com/aeglodetailweb/api/skuInfo`, searchParams ].join('?');
//   console.log(url);
//   return fetch(
//     url,
//     {
//       headers: {
//         Origin: 'https://de.aliexpress.com',
//         Referer: 'https://de.aliexpress.com',
//       }
//     }
//   )
// })
// .then(res => res.json())
// .then(data => console.log(JSON.stringify(data, null, '  ')))



// fetch(
//   `https://portals.aliexpress.com/promote/generateShortLinkFromSc.do`,
//   {
//     method: 'POST',
//     headers: {
//       Origin: 'https://de.aliexpress.com',
//       Referer: 'https://de.aliexpress.com',
//       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryHOfajvSAenyBmVJI',
//       'x-xsrf-token': '15nqfi6vkl_36',
//       'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
//     },
//     body: Object.entries({productId: 1005002252415927}).reduce((all, entry) => all.concat(entry.join('='))).join('&')
//   }
// )
// .then(res => res.text())
// .then(data => console.log(data))
