const createStrapiInstance = require("./scripts/strapi-custom");

(async () => {
  const strapi = await createStrapiInstance();

  const [giftIdeas] = await Promise.all([
    strapi.services.product.find({ website_tab: "gifts", tags_in: [2, 1], _sort: 'id:desc' }),
  ]);

  // console.log({ count });
  console.log({ giftIdeas: giftIdeas.length });
  process.exit();
})();
