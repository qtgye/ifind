/**
 * Retrieves a list of products for admin product listing
 * @param {Object} args - Product query arguments
 * @returns { count, products: [Product]}
 */
module.exports = async (args) => {
  const whereParams = {};
  const otherParams = {
    _limit: args.limit || 10,
    _sort: args.sort || "id:desc",
    _start: args.start || 0,
  };

  if (args.where && args.where.search) {
    whereParams.title_contains = args.where.search;
  }

  if (args.where && args.where.category) {
    whereParams.category = args.where.category;
  }

  const [count, products] = await Promise.all([
    strapi.services.product.count({
      ...whereParams,
      ...otherParams,
    }),
    strapi.services.product.find({
      ...whereParams,
      ...otherParams,
    }),
  ]);

  return { count, products };
};
