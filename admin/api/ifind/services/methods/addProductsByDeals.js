const deleteProductsByDeals = require("./deleteProductsByDeals");

/**
 * @param {{deal_type: string, products: Product[]}} params
 */
module.exports = async ({ deal_type, products }) => {
  // Delete products first
  await deleteProductsByDeals({ deal_type });

  // Add new products
  const newProducts = await Promise.all(
    products.map(
      async (productData) => await strapi.services.product.create(productData)
    )
  );

  return newProducts;
};
