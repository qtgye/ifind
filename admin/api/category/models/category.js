'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processCategoryData = async data => {
  if ( data.label && data.label.length ) {
    const englishLanguage = await strapi.services.language.findOne({ code: 'en' });
    const englishLabel = data.label.find(label => label.language == englishLanguage.id);
    const selectedLabel = englishLabel || data.label[0];
    data.label_preview = selectedLabel.label;
  }
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processCategoryData(data);
    },
    async beforeUpdate(params, data) {
      await processCategoryData(data);
    }
  }
};
