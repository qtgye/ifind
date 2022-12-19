const { all } = require("../../../helpers/scripts-server/deal-categories");

module.exports = {
  query: `
      offersCategories: [OffersCategory]
    `,
  resolveQuery: {
    async offersCategories() {
      const dealCategories = await all();

      return Object.values(dealCategories);
    },
  },
};
