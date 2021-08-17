/**
 * Updates links for all products using affiliate links
 * @returns [Product]
 */
module.exports = async () => {
  const allProducts = await strapi.services.product.find({ _limit: 99999 });

  return await Promise.all(
    // Extract and set fixed data for each product
    allProducts
      .map((product) => {
        product.amazon_url = amazonLink(product.amazon_url);

        if (product.url_list && product.url_list.length) {
          product.url_list.forEach((urlData) => {
            if (urlData.source) {
              switch (true) {
                case /ebay/i.test(urlData.source.name):
                  urlData.url = ebayLink(urlData.url);
                  break;
              }
            }
          });
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
