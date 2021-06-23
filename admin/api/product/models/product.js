'use strict';

const { removeURLParams } = appRequire('helpers/url');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processProductData = (data) => {
  // Remove unnecessary params in the url
  if ( data?.url_list?.length ) {
    data.url_list = data.url_list.map(urlData => {
      urlData.url = removeURLParams(urlData.url);
      return urlData;
    });
  }

  return data;
};

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processProductData(data);
    },
    async beforeUpdate(params, data) {
      await processProductData(data);
    }
  }
};
