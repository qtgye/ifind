const offersCategories = require("../offers-categories");

module.exports = {
  query: `
      offersCategories: [OffersCategory]
    `,
  resolveQuery: {
    async offersCategories() {
      return await Promise.all(
        Object.entries(offersCategories).map(async ([id, offerCategory]) => ({
          ...offerCategory,
          id,
        }))
      );
    },
  },
};
