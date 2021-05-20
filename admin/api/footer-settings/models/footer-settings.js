'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      console.log('beforeCreate', { data });
    },
    beforeUpdate: async (params, data) => {
      // console.log('models', strapi.models);
      // console.log('services', strapi.services);
      data.links && data.links.forEach(link => {
        link.label_preview = link.label.map(label => label.text).join(' | ');
      });
    },
  }
};
