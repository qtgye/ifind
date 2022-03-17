const offersCategories = require("../offers-categories");

module.exports = {
  query: `
      offerCategories: [OffersCategory]
    `,
  resolveQuery: {
    async offerCategories() {
      return await Promise.all(
        Object.entries(offersCategories).map(async ([id, offerCategory]) => ({
          ...offerCategory,
          id,
        }))
      );
    },
  },
};
