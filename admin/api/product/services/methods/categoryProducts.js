const { getTranslatedLabel } = appRequire("helpers/category");

const sortCategoryProducts = (categoryID, products) => {
  // Filter only published products
  const filteredProducts = products.filter(
    ({ status }) => status === "published"
  );

  // Sort by position, ascending
  filteredProducts.sort((prodA, prodB) =>
    prodA.position > prodB.position ? 1 : -1
  );

  // Get only first 5 products
  return filteredProducts.slice(0, 5).map((product) => ({
    ...product,
    category: categoryID,
  }));
};

/**
 * Retrieves a list of products for the given list of categories
 * Return format is in the form of array of NaturalList items
 * @param {String} language
 * @param {Array<ID>} categories - List of category IDs
 */
module.exports = async (language = "en", categories = []) => {
  // Get all categories data from the given list of category IDs,
  // Filtering only the ones with products
  const categoriesWithProducts = await strapi.services.category.find({
    products_count_gt: 0,
    _id_in: categories,
    _sort: "order:ASC",
    _limit: 9999,
  });

  // Map through each category,
  // Build a NaturalList data for each category
  return await Promise.all(
    categoriesWithProducts.map(async (category) => {
      return {
        category: {
          ...category,
          label: await getTranslatedLabel(category.label),
        },
        products: sortCategoryProducts(category.id, category.products || []),
      };
    })
  );
};
