'use strict';

const { filterProductsWithProblems } = appRequire('helpers/product');
const { isAmazonLink, ebayLink, amazonLink } = appRequire('helpers/url');

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

const getTranslatedLabel = async (categoryLabels, language = "en") => {
  const [
    targetLanguage,
    englishLanguage,
  ] = await Promise.all([
    strapi.services.language.findOne({ code: language }),
    strapi.services.language.findOne({ code: 'en' }),
  ]);

  const matchedLabel = (
    categoryLabels.find(({language}) => language.id === targetLanguage.id)
    || categoryLabels.find(({language}) => language.id === englishLanguage.id)
    || categoryLabels[0]
  )

  return matchedLabel ? matchedLabel.label : '';

}

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async productComparisonList(language) {
    // Selected fields to return for product
    const populate = [
      'id',
      'title',
      'price',
      'image',
      'category',
    ];

    // Granchildren categories
    // const endpointCategories = await extractEndpointCategories(categoryTree);
    const endpointCategories = await strapi.services.category.find({
      children_count: 0,
      _sort: 'order:ASC',
    });

    const productsLists = await Promise.all((
      endpointCategories.map(async (category) => (
        {
          category: {
            ...category,
            label: await getTranslatedLabel(category.label),
          },
          products: category.products.map(product => ({
            ...product,
            category: category.id,
          })),
        }
      ))
    ));


    return productsLists;
  },

  async getProductDetails(productID, language) {
    if ( productID ) {
      const productDetails = await this.findOne({ id: productID });
      return productDetails;
    }

    return '';
  },

  async addProductClick(productID) {
    if ( !productID ) {
      return null;
    }

    const matchedProduct = await this.findOne({ id: productID });

    if ( !matchedProduct ) {
      return null;
    }

    // Increment clicks count
    const clicks_count = Number(matchedProduct.clicks_count) + 1;

    // Update product
    await this.update({ id: productID }, {
      clicks_count,
      updateScope: {
        price: false,
        amazonDetails: false,
      }
    });

    return {
      id: productID,
      clicks_count
    };
  },

  async fixProducts() {
    const allProducts = await this.find({ _limit: 99999 });
    const productsWithProblems = filterProductsWithProblems(allProducts);

    return await Promise.all(
      // Extract and set fixed data for each product
      productsWithProblems.map(product => {
        const productChanges = product.product_changes || [];

        // Sort from recent changes
        productChanges.sort((changeA, changeB) => changeA.date_time >= changeB.date_time ? -1 : 1);

        // Fix amazon_url
        if ( !isAmazonLink(product.amazon_url) ) {
          const changeWithAmazonURL = productChanges.find(({ state }) => state && isAmazonLink(state.amazon_url));
          // Apply old valid amazon url
          if ( changeWithAmazonURL ) {
            product.amazon_url = changeWithAmazonURL.state.amazon_url;
          }
        }
        // Fix url_list
        if ( !product.url_list || !product.url_list.length ) {
          const changeWithURLList = productChanges.find(({ state }) => (
            state && state.url_list && state.url_list.length
          ));
          // Apply old url list if any
          if ( changeWithURLList ) {
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
      .map(async productUpdates => {
        const { id, ...productData } = productUpdates;

        // Prevent lifecycle from scraping
        productData.updateScope = {
          price: false,
          amazonDetails: false,
        }

        const result = await this.update({ id }, productData );
        return result;
      })
    );
  },

  // Updates Product Links for all products
  async updateProductLinks() {
    const allProducts = await this.find({ _limit: 99999 });

    return await Promise.all(
      // Extract and set fixed data for each product
      allProducts.map(product => {
        product.amazon_url = amazonLink(product.amazon_url);

        if ( product.url_list && product.url_list.length ) {
          product.url_list.forEach(urlData => {
            if ( urlData.source ) {
              switch ( true ) {
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
      .map(async productUpdates => {
        const { id, ...productData } = productUpdates;

        // Prevent lifecycle from scraping
        productData.updateScope = {
          price: false,
          amazonDetails: false,
        }

        const result = await this.update({ id }, productData );
        return result;
      })
    );
  },

  // Get products list
  async productsList(args) {
    const whereParams = {};
    const otherParams = {
      _limit: args.limit || 10,
      _sort: args.sort || "id:desc",
      _start: args.start || 0,
    };

    if ( args.where && args.where.search ) {
      whereParams.title_contains = args.where.search;
    };

    if ( args.where && args.where.category ) {
      whereParams.category = args.where.category;
    };

    const [
      count,
      products,
    ] = await Promise.all([
      strapi.services.product.count({
        ...whereParams,
        ...otherParams,
      }),
      strapi.services.product.find({
        ...whereParams,
        ...otherParams,
      }),
    ]);

    return { count, products };
  },

};
