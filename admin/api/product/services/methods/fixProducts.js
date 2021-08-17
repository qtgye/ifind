/**
 * Fixes all products in terms of missing URLs or price.
 * Traverses each product's change history, and retrieves necessary Details from them.
 * @returns [Product]
 */
module.exports = async () => {
  const allProducts = await strapi.services.product.find({ _limit: 99999 });
  const productsWithProblems = filterProductsWithProblems(allProducts);

  return await Promise.all(
    // Extract and set fixed data for each product
    productsWithProblems
      .map((product) => {
        const productChanges = product.product_changes || [];

        // Sort from recent changes
        productChanges.sort((changeA, changeB) =>
          changeA.date_time >= changeB.date_time ? -1 : 1
        );

        // Fix amazon_url
        if (!isAmazonLink(product.amazon_url)) {
          const changeWithAmazonURL = productChanges.find(
            ({ state }) => state && isAmazonLink(state.amazon_url)
          );
          // Apply old valid amazon url
          if (changeWithAmazonURL) {
            product.amazon_url = changeWithAmazonURL.state.amazon_url;
          }
        }
        // Fix url_list
        if (!product.url_list || !product.url_list.length) {
          const changeWithURLList = productChanges.find(
            ({ state }) => state && state.url_list && state.url_list.length
          );
          // Apply old url list if any
          if (changeWithURLList) {
            product.url_list = changeWithURLList.state.url_list;
          }
        }

        // Only apply updates to selected properties
        return {
          id: product.id,
          amazon_url: product.amazon_url,
          url_list: product.url_list,
        };
      })
      // Then, save all these updated products,
      // Returning the full data for each product
      .map(async (productUpdates) => {
        const { id, ...productData } = productUpdates;

        // Prevent lifecycle from scraping
        productData.updateScope = {
          price: false,
          amazonDetails: false,
        };

        const result = await strapi.services.product.update(
          { id },
          productData
        );
        return result;
      })
  );
};
