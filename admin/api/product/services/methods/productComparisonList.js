const { getTranslatedLabel } = appRequire("helpers/category");

const sortCategoryProducts = (products) => {
  // Sort by position, ascending
  products.sort((prodA, prodB) => (prodA.position > prodB.position ? 1 : -1));

  // Get only first 5 products
  return products.slice(0, 4).map((product) => ({
    ...product,
    category: category.id,
  }));
};

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
    _limit: 9999,
  });

  const productsLists = await Promise.all(
    endpointCategories.map(async (category) => ({
      category: {
        ...category,
        label: await getTranslatedLabel(category.label),
      },
      products: sortCategoryProducts(category.products || []),
    }))
  );

  return productsLists;
};
