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

  products.forEach((product, index) => {
    if (index % 10 === 0) {
      productChunks.push([]);
    }

    productChunks[productChunks.length - 1].push(product);
  });

  for (productsGroup of productChunks) {
    const addedProducts = await Promise.all(
      productsGroup.map(
        async (productData) => await strapi.services.product.create(productData)
      )
    );

    newProducts.push(...addedProducts);
  }

  console.info(`Added ${newProducts.length} new products.`.bold.green);

  return newProducts;
};
