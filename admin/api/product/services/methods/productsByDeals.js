const dealTypes = appRequire("api/ifind/deal-types");

const PRODUCTS_PER_PAGE = 999999;

module.exports = async ({ deal_type = "", start = 0 }) => {
  const sources = await strapi.services.source.find();

  const productsByDeals = await Promise.all(
    Object.entries(dealTypes)
      .filter(([dealTypeKey]) => (deal_type ? dealTypeKey === deal_type : true))
      .map(async ([dealTypeKey, { site, label }]) => {
        const [products, total_products] = await Promise.all([
          strapi.services.product.find({
            deal_type: dealTypeKey,
            _limit: PRODUCTS_PER_PAGE,
            _start: start,
            _sort: "deal_quantity_available_percent:ASC,quantity_available_percent:ASC",
          }),
          strapi.services.product.count({
            deal_type: dealTypeKey,
          }),
        ]);

        const source = sources.find(({ name }) =>
          new RegExp(site, "i").test(name)
        );

        return {
          deal_type: {
            name: dealTypeKey,
            label,
            source,
          },
          products,
          total_products,
        };
      })
  );

  return productsByDeals;
};
