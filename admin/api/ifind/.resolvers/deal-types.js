module.exports = {
  query: `
    productsByDeals( deal_type: String , start: Int, offer_category: String ): [ProductsByDeal]
  `,
  mutation: `
    deleteProductsByDeals( deal_type: String ): [ID]
    addProductsByDeals( deal_type: String!, products: [ProductInput] ): [Product]
  `,
  resolveQuery: {
    async productsByDeals(_, args) {
      return await strapi.services.ifind.productsByDeals(args);
    },
  },
  resolveMutation: {
    async deleteProductsByDeals(_, args) {
      return await strapi.services.ifind.deleteProductsByDeals(args);
    },
    async addProductsByDeals(_, args) {
      console.log({ strapi });
      return await strapi.services.ifind.addProductsByDeals(args);
    }
  },
};
