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
 * @param {Boolean} includeDescendants - Available onlyl when category is a single ID
 *                                     - Whether to include products from descendant categories
 */
module.exports = async (language = "en", categories = [], includeDescendants = false) => {
  const findCategoriesParams = {
    products_count_gt: 0,
    _sort: "order:ASC,id:DESC",
    _limit: 9999,
    id_in: categories,
  };

  // Include descendants if requested,
  // Or if provided categories list is empty
  if ( includeDescendants || !categories.length ) {
    const ascendantsIDs = [];

    // Use first category from CategoryTree if none is provided
    if ( !categories.length ) {
      const [firstCategory] = await strapi.services.category.find({
        _sort: "order:asc,id:desc",
        parent_null: true,
      });

      if ( firstCategory ) ascendantsIDs.push(firstCategory.id);
    }
    else {
      ascendantsIDs.push(...categories);
    }

    const descendants = await strapi.services.category.find({
      _limit: 9999,
      ascendants_in: ascendantsIDs,
      products_count_gt: 0,
    });

    // Ensure no duplicate IDs
    [ ...findCategoriesParams.id_in ] = new Set([
      ...findCategoriesParams.id_in,
      ...descendants.map(({ id }) => id),
    ]);

    console.log({ findCategoriesParams });
  }

  // Get all categories data from the given list of category IDs,
  // Filtering only the ones with products
  const categoriesWithProducts = await strapi.services.category.find(findCategoriesParams);

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
