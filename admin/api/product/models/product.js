'use strict';

const { removeURLParams } = appRequire('helpers/url');
const { getProductDetails } = appRequire('helpers/product');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processProductData = async (data, id) => {
  await Promise.all([

    // Remove unnecessary params in the url
    (() => {
      if ( data && data.url_list && data.url_list.length ) {
        data.url_list = data.url_list.map(urlData => {
          urlData.url = removeURLParams(urlData.url);
          return urlData;
        });
      }
    })(),

    // Add dynamic position if not yet given
    (async() => {
      if ( !data.position ) {
        const productsWithPositions = await strapi.services.product.find({
          position_gt: 0,
          id_ne: id,
          categories_contains: Array.isArray(data.categories) && data.categories.length
                                ? data.categories[0] : null
        });

        const takenPositions = productsWithPositions.map(data => data.position);
        let positionToTake = 1;

        // Determine available position
        while ( takenPositions.includes(positionToTake) ) {
          positionToTake++;
        }

        data.position = positionToTake;
      }
    })(),

    // Scrape other fields
    (async() => {
      const productDetails = await getProductDetails(data.amazon_url, 'de');

      if ( productDetails ) {
        data.title = productDetails.title.trim();
        data.details_html = productDetails.details_html.trim();
        data.price = productDetails.price;
        data.image = productDetails.image;
      }
    })(),
  ]);

  return data;
};

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processProductData(data);
    },
    async beforeUpdate(params, data) {
      await processProductData(data, params.id);
    },
  }
};
