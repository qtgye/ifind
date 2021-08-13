const fetch = require('node-fetch');
const { appId } = require('./config');
const { toSearchParams } = require('../url');

const BASE_URL = 'https://open.api.ebay.com/shopping';
const params = {
  responseencoding: 'JSON',
  siteid: 0,
  version: 967,
  appId: appId,
}

const getDetailsFromURL = async(productURL) => {
  // Extract ebay itemID
  const [ itemID ] = productURL.match(/[0-9]{9,12}/g) || [];

  if ( itemID ) {
    const requestParams = {
      ...params,
      callname: 'GetSingleItem',
      ItemID: itemID,
      IncludeSelector: 'Details',
    };
    const res = await fetch(BASE_URL + toSearchParams(requestParams));
    const { Item } = await res.json();
    const data = {};

    if ( Item && Item.CurrentPrice && Item.CurrentPrice.Value ) {
      data.price = Item.CurrentPrice.Value;
    }

    return data;
  }

  return null;
}

module.exports = {
  getDetailsFromURL
};
