module.exports = {
  definition: `
    type ProductDetails {
      detailHTML: String
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
    productDetails (id: ID!, language: String): ProductDetails
    productComparisonList (language: String!): [NaturalList]
  `,
  resolver: {
    Query: {
      async productDetails(_, args) {
        const productDetails = await strapi.services.product.getProductDetails(args.id, args.language);
        console.log(Object.keys(productDetails));
        return productDetails;
      },

      async productComparisonList(_, args) {
        const productComparisonList = await strapi.services.product.productComparisonList(args.language);
        return productComparisonList;
      }
    }
  }
};
