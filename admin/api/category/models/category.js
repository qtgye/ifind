'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processCategoryData = async data => {
  if ( data.language ) {
    // console.log('strapi.services', strapi.services);
    const language = await strapi.services.language.findOne({ id: data.language });
    data.label_preview = `(${language.code}) ${data.label}`;
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
