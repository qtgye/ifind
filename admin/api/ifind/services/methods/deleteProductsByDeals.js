module.exports = async ({ deal_type = "" }) => {
  console.log(`Deleting old products from deal: ${deal_type} ...`.yellow);

  const deletedProducts = await strapi.services.product.delete({
    deal_type,
  });

  console.log(`Deleted ${deletedProducts.length} product(s).`.cyan);

  return [];
};
