module.exports = {
  query: `
    productsByDeals( deal_type: String , start: Int ): [ProductsByDeal]
  `,
  resolveQuery: {
    async productsByDeals(_, args) {
      return await strapi.services.ifind.productsByDeals(args);
    },
  },
};
