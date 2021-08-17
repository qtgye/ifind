const { getTranslatedLabel } = appRequire("helpers/category");

/**
 * Retrieves a listing of products for Product Comparison page
 * @param {String} language
 * @returns Array
 */
module.exports = async (language) => {
  // Granchildren categories
  const endpointCategories = await strapi.services.category.find({
    children_count: 0,
    products_count_gt: 0,
    _sort: "order:ASC",
  });

  const productsLists = await Promise.all(
    endpointCategories.map(async (category) => ({
      category: {
        ...category,
        label: await getTranslatedLabel(category.label),
      },
      products: category.products.map((product) => ({
        ...product,
        category: category.id,
      })),
    }))
  );

  return productsLists;
};
