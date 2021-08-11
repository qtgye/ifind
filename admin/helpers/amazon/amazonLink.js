const { affiliateParams } = require('./config');

const amazonLink = (originalLink = '') => {
  const [ baseURL, searchParamsString = '' ] = originalLink.split('?');

  const searchParamsObj = searchParamsString.split('&').reduce((obj, param) => {
    const [ key, value ] = param.split('=');

    if ( key && value ) {
      obj[key] = value;
    }

    return obj;
  }, {});

  return baseURL + toSearchParams({
    ...searchParamsObj,
    ...affiliateParams,
  });
}

module.exports = amazonLink;
