const offersCategories = require("../offers-categories");

module.exports = {
  query: `
      offerCategories: [OffersCategory]
    `,
  resolveQuery: {
    async offerCategories() {
      return await Promise.all(
        Object.entries(offersCategories).map(async ([id, offerCategory]) => {
          console.log(offerCategory.dealTypes);

          // Get products by deals
          const productsByDeals = await Promise.all(
            offerCategory.dealTypes.map((deal_type) =>
              strapi.services.ifind
                .productsByDeals({
                  deal_type,
                })
                .then(([productsByDeal]) => productsByDeal)
            )
          );

          console.log(productsByDeals);

          return {
            ...offerCategory,
            id,
            productsByDeals,
          };
        })
      );
    },
  },
};
