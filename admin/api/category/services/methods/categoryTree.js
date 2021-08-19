/**
 * Retrieves a nested list of categories according to parent-children hierarchy.
 * @param {String} language
 * @returns CategoryTree
 */
module.exports = async (language = null) => {
  // Will use to select label for categories
  const matchedLanguage = await strapi.services.language.findOne({
    code: language,
  });

  // Get categories sorted by order
  // ensures children are in order
  const matchedCategories =
    (await strapi.services.category.find({
      _sort: "order:ASC",
      _limit: 1000,
    })) || [];

  // Build categoryTree object
  const categoryTree = {};
  const byId = matchedCategories.reduce(
    (all, category) => ({
      ...all,
      [category.id]: category,
    }),
    {}
  );

  await Promise.all(
    matchedCategories.map(async (category) => {
      const processedCategory =
        await strapi.services.category.preProcessCategory(
          category,
          matchedLanguage
        );

      // Check if category has existing parent
      if (processedCategory.parent && processedCategory.parent.id in byId) {
        // Append to the parent's children
        byId[processedCategory.parent.id].children =
          byId[processedCategory.parent.id].children || [];
        byId[processedCategory.parent.id].children.push(processedCategory);
      }
      // Treat this category as a root
      else {
        categoryTree[category.id] = processedCategory;
        processedCategory.depth = 0;
        // Remove non-existing parent prop to avoid confusion
        delete processedCategory.parent;
      }
    })
  );

  // Convert categoryTree into array
  const categoryTreeArray = Object.values(categoryTree);

  // Re-sort root categories
  categoryTreeArray.sort((catA, catB) => (catA.order >= catB.order ? 1 : -1));

  return categoryTreeArray;
};
