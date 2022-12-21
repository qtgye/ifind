require("colors");
const deleteProductsByDeals = require("./deleteProductsByDeals");

/**
 * @param {{deal_type: string, products: Product[]}} params
 */
module.exports = async ({ deal_type, products }) => {
  // Delete products first
  await deleteProductsByDeals({ deal_type });

  // Add new products
  // Save products by chunks of 10, so the system won't crash
  const productChunks = [];
  const newProducts = [];

  for (let product of products) {
    const addedProduct = await strapi.services.product.create(product);
    newProducts.push(addedProduct);
  }

  console.info(`Added ${newProducts.length} new products.`.bold.green);

  return newProducts;
};
