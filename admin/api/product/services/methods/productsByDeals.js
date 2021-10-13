const deal_types = [
  "amazon_flash_offers",
  "ebay_wow_offers",
  "aliexpress_value_deals",
];

module.exports = async () => {
  const productsByDeals = await Promise.all(
    deal_types.map(async (deal_type) => {
      const products = await strapi.services.product.find({
        deal_type,
        _limit: 20,
        _sort: "id:DESC",
      });

      return {
        deal_type,
        products,
      };
    })
  );

  return productsByDeals;
};
