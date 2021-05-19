'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processPageData = async (data) => {
  const languages = await strapi.services.language.find();
  const englishLanguage = languages.find(language => language.code === 'en');

  if ( !englishLanguage ) {
    return;
  }

  if ( !data.page_data || !data.page_data.length ) {
    return;
  }

  const englishData = data.page_data.find(page_data => page_data.language === englishLanguage.id);

  if ( englishData ) {
    data.slug = englishData.title.toLowerCase().replace(/[^A-Z0-9-]/gi, '-');
    data.title_preview = englishData.title;
  }
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processPageData(data);
    },
    async beforeUpdate(params, data) {
      await processPageData(data);
    },
  }
};
