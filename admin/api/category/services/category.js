'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async categoryTree(language) {

    const matchedLanguage = await strapi.services.language.findOne({
      code: language
    });

    if ( !matchedLanguage ) {
      return null;
    }

    const matchedCategories = await this.find({
      language: matchedLanguage.id
    });

    // Build category tree
    const categoryTree = {};

    // Sort by order first, ensures children are in order
    matchedCategories.sort((catA, catB) => catA.order >= catB.order ? 1 : -1);

    matchedCategories.forEach(category => {

      // If child category
      if ( category.parent ) {
        // Check if parent is already mapped in the tree
        // otherwise add a placeholder for it
        if ( !(category.parent.id in categoryTree) ) {
          categoryTree[category.parent.id] = { children: [] };
        }

        // Add this category to parent's children
        categoryTree[category.parent.id].children.push(category);
      }

      // Treat as parent category if no parent prop
      else {
        categoryTree[category.id] = {
          // Merge with placeholder if there is one
          ...(categoryTree[category.id] || { children: [] }),
          ...category
        }
      }
    });

    // Re-sort again, this time for parent
    const categories = Object.values(categoryTree).sort((catA, catB) => catA.order >= catB.order ? 1 : -1);

    return {
      language: matchedLanguage,
      categories,
    }
  }
};
