'use strict';

const { fetchProductDetails } = appRequire('helpers/product');

const extractEndpointCategories = (categoryTree) => {
  const endpointCategories = [];

  categoryTree.forEach(category => {
    if ( category.children ) {
      endpointCategories.push(...extractEndpointCategories(category.children));
    }
    else {
      endpointCategories.push(category);
    }
  });

  return endpointCategories;
}

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async productComparisonList(language) {
    const categoryTree = await strapi.services.category.categoryTree(language);

      // Granchildren categories
      const endpointCategories = extractEndpointCategories(categoryTree);
      const categoryIDs = endpointCategories.map(({ id }) => id);
      const productsLists = await Promise.all((
        endpointCategories.map(async (category) => (
          {
            category,
            products: await strapi.services.product.find({
              categories: [ category.id ],
              website_tab: 'product_comparison',
              _limit: 5,
            })
          }
        ))
      ));

      return productsLists;
  },

  async getProductDetails(productID, language) {
    if ( productID ) {
      const productDetails = await fetchProductDetails(productID, language);
      return productDetails;
    }

    return '';
  }
};
