'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */


const processCategory = (rawCategory, language = null) => {
  /**
  Process label

  Label logic:
    1. If there is/are label entries
      1.1. If language is given, get label with matching language
      1.2 Get english label
      1.3 Get first label
    2. Use empty label
   */
  rawCategory.label = rawCategory.label ?
    rawCategory.label.find(label => language && label.language.code === language.code)
    || rawCategory.label.find(label => label.language.code === 'en')
    || rawCategory.label[0]
    : '';

  return rawCategory;
};


module.exports = {
  async categoryTree(language = null) {

    // TODO: Remove once single category tree is implemented (no source/region needed)
    const matchedRegion = await strapi.services.region.findOne({
      code: 'de'
    });

    // Will use to select label for categories
    const matchedLanguage = await strapi.services.language.findOne({
      code: language
    });

    const matchedCategories = await this.find({
      region: matchedRegion.id // TODO: Remove once single category tree is implemented (no source/region needed)
    }) || [];

    // Sort by order first, ensures children are in order
    matchedCategories.sort((catA, catB) => catA.order >= catB.order ? 1 : -1);

    // Build categoryTree object
    const categoryTree = {};
    const byId = matchedCategories.reduce(( all, category) => ({
      ...all,
      [category.id]: category,
    }), {});

    matchedCategories.forEach(category => {

      const processedCategory = processCategory(category, matchedLanguage);

      // Check if category has existing parent
      if ( processedCategory.parent && processedCategory.parent.id in byId ) {
        // Append to the parent's children
        byId[processedCategory.parent.id].children = byId[processedCategory.parent.id].children || [];
        byId[processedCategory.parent.id].children.push(processedCategory);
      }
      // Treat this category as a root
      else {
        categoryTree[category.id] = processedCategory;
        processedCategory.depth = 0;
        // Remove non-existing parent prop to avoid confusion
        delete processedCategory.parent;
      }
    });

    // Convert categoryTree into array
    const categoryTreeArray = Object.values(categoryTree);

    return categoryTreeArray;
  }
};
