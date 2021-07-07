'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processCategoryData = async data => {
  const productAttributes = await strapi.services['product-attribute'].getCommon();

  if ( data.label && data.label.length ) {
    const englishLanguage = await strapi.services.language.findOne({ code: 'en' });
    const englishLabel = data.label.find(label => label.language == englishLanguage.id);
    const selectedLabel = englishLabel || data.label[0];
    data.label_preview = selectedLabel.label;
  }

  if ( data.product_attrs && data.product_attrs.length ) {
    data.product_attrs.forEach(catProductAttr => {
      const matchedProductAttr = productAttributes.find(({ id }) => id === catProductAttr.product_attribute);
      catProductAttr.label_preview = `${matchedProductAttr.name} (${catProductAttr.factor})`
    });
  }
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processCategoryData(data);
    },
    async beforeUpdate(params, data) {
      await processCategoryData(data);
    },
    async afterFindOne(result, params, populate) {
      return await strapi.services.category.prepopulateProductAttributes(result);
    },
    async afterCreate(result, data) {
      console.log('afterCreate', {result, data});
    },
    async afterUpdate(result, params, data) {
      console.log('afterUpdate', {result, params, data});
    }
  }
};
