const { fetchProductDetails } = appRequire('helpers/product');

module.exports = {
  definition: `
    type ProductDetails {
      detailHTML: String!
    }
    type ProductCategory {
      label: ComponentAtomsTranslateableLabel
      id: ID!
    }
    type NaturalList {
      category: ProductCategory
      products: [Product]
    }
  `,
  query: `
    productDetails (id: ID!): ProductDetails
    productComparisonList (language: String!): [NaturalList]
  `,
  resolver: {
    Query: {

      async productDetails(_, args) {
        const product = await strapi.services.product.findOne({
          id: args.id
        });

        if ( product ) {
          const productDetails = await fetchProductDetails(product);
          console.log({ productDetails });
        }

        return null
      },

      async productComparisonList(_, args) {
        const productComparisonList = await strapi.services.product.productComparisonList(args.language);
        return productComparisonList;
      }
    }
  }
};
