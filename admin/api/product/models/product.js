'use strict';
const moment = require('moment');
const { compareProductChanges } = require('../../../helpers/productChanges');

const { amazonLink, ebayLink } = appRequire('helpers/url');
const { getProductDetails } = appRequire('helpers/product');
const { applyCustomFormula } = appRequire('helpers/productAttribute');

const updateScopeDefault = {
  price: true,
  amazonDetails: true,
};

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processProductData = async (data, id) => {
  // Save admin_user for afterSave hook
  strapi.admin_user = data.admin_user;

  const matchedProduct = await strapi.services.product.findOne({ id }) || {};

  // Set product update scope
  data.updateScope = {
    ...updateScopeDefault,
    ...data.updateScope,
  };

  // No need for additional scraped data if no price and details update needed
  // Use case: clicks_count update only
  if ( !data.updateScope.price || !data.updateScope.amazonDetails ) {
    return data;
  }

  const [
    ebaySource,
    productAttributes,
  ] = await Promise.all([
    strapi.services.source.findOne({
      name_contains: 'ebay'
    }),
    strapi.services['product-attribute'].find(),
  ]);

  await Promise.all([
    // Add necessary params in the url
    (() => {
      data.url_list = data && data.url_list && data.url_list.length ?
      (
        data.url_list = data.url_list.map(urlData => {
          if ( ebaySource && ebaySource.id && urlData.source == ebaySource.id ) {
            urlData.url = ebayLink(urlData.url);
          }

          return urlData;
        })
      )
      : [];
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
      // Using only image and title for checking
      // For some reason, details_html is not passed on update
      // TODO: Add admin UI option to select either priceOnly, amazonDetails, both or neither
      const scapePriceOnly = data.title && data.image && true;

      const productDetails = await getProductDetails(data, 'de', scapePriceOnly);

      // Apply scraped data
      if ( productDetails ) {
        Object.entries(productDetails).forEach(([ key, value ]) => {
          data[key] = value;
        });
        // Temporary data
        data.releaseDate = productDetails.releaseDate;
      }
    })(),

    // Add Affiliate links
    (async() => {
      data.amazon_url = amazonLink(data.amazon_url);
    })(),
  ]);

  // Recompute product attributes
  // Needs to come after the scraper in order to pickup the scraped data
  data.attrs_rating = data.attrs_rating.map(attrRating => {
    const matchedProductAttribute = productAttributes.find(({ id }) => (
      attrRating.product_attribute == id
    ));

    // Autofill release date if applicable
    if ( /release/i.test(matchedProductAttribute.name) && data.releaseDate ) {
      attrRating.use_custom_formula = true;
      attrRating.min = data.releaseDate;
      attrRating.max = moment.utc().subtract(3, 'years').toISOString();
    }

    if ( attrRating.use_custom_formula ) {
      attrRating.rating = applyCustomFormula(
        attrRating,
        matchedProductAttribute,
        data,
      )
    }

    return attrRating;
  });

  // Remove temporary data
  delete data.updateScope;
  delete data.releaseDate;

  // Extract only changed data
  const changedData = compareProductChanges(matchedProduct, data);

  // Save temporary data for afterSave use
  strapi.changedData = changedData;

  return changedData;
};

/**
 * TODO:
 * Figure out how to get updatedBy
 */
const saveProductChange = async (id, changeType = 'update') => {
  const date_time = moment.utc().toISOString();
  const admin_user = strapi.admin_user;
  const state = strapi.changedData;
  let change_type = changeType;

  // Delete unnecessary temporary data
  delete strapi.changedData;

  // No need to save to history if there's no changes
  if ( !state ) {
    return;
  }

  // Determine change_type
  if ( 'status' in state && changeType !== 'create' ) {
     change_type = 'publish';
  }

  await strapi.query('product-change').create({
    state,
    date_time,
    admin_user,
    product: id,
    change_type,
  });
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processProductData(data);
    },
    async beforeUpdate(params, data) {
      await processProductData(data, params.id);
    },
    async afterCreate(result) {
      await saveProductChange(result.id, 'create');
    },
    async afterUpdate(result) {
      await saveProductChange(result.id);
    }
  }
};
