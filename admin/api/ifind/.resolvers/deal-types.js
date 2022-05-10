module.exports = {
  query: `
    productsByDeals( deal_type: String , start: Int, offer_category: String ): [ProductsByDeal]
  `,
  mutation: `
    deleteProductsByDeals( deal_type: String ): [ID]
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
  },
};
