module.exports = async () => {
  // Get only granchild categories
  const categories = await strapi.services.category.find({
    children_count: 0,
    _limit: 9999,
  });

  // Update each category
  const mappedCategories = categories.map(({ products, id }) => ({
    where: { id },
    data: { products_count: products.length },
  }));

  // Bulk updates
  const updatedCategories = await strapi.services.category.updateMultiple(
    mappedCategories
  );

  return updatedCategories;
};
