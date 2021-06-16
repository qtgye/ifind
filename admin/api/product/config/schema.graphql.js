const { fetchProductDetails } = appRequire('helpers/product');

module.exports = {
  definition: `
    type ProductDetails {
      detailHTML: String!
    }
  `,
  query: `
    productDetails (id: ID!): ProductDetails
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
      }
    }
  }
};
