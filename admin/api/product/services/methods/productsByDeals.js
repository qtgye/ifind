const dealTypes = appRequire("api/ifind/deal-types");

const PRODUCTS_PER_PAGE = 999999;

module.exports = async ({ deal_type = "", start = 0 }) => {
  const sources = await strapi.services.source.find();
  const scheduledTasks = await strapi.scheduledTasks.list();

  const productsByDeals = await Promise.all(
    Object.entries(dealTypes)
      .filter(([dealTypeKey]) => (deal_type ? dealTypeKey === deal_type : true))
      .map(async ([dealTypeKey, { site, label, nav_label, nav_icon }]) => {
        const [products, total_products] = await Promise.all([
          strapi.services.product.find({
            deal_type: dealTypeKey,
            _limit: PRODUCTS_PER_PAGE,
            _start: start,
            _sort:
              "deal_quantity_available_percent:ASC,quantity_available_percent:ASC",
          }),
          strapi.services.product.count({
            deal_type: dealTypeKey,
          }),
        ]);

        const source = sources.find(({ name }) =>
          new RegExp(site, "i").test(name)
        );

        // Get last run data from scheduled task
        const matchedScheduledTask = scheduledTasks.find(
          ({ meta }) => meta && meta.deal_type === dealTypeKey
        );

        const last_run = matchedScheduledTask
          ? matchedScheduledTask.last_run
          : null;

        return {
          deal_type: {
            name: dealTypeKey,
            label,
            source,
            last_run,
            nav_label,
            nav_icon,
          },
          products,
          total_products,
        };
      })
  );

  return productsByDeals;
};
