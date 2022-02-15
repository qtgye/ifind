/**
 * Removes references to non-existing languages
 */
require("colors");
const createStrapiInstance = require("./strapi-custom");

(async () => {
  const strapi = await createStrapiInstance();
  const categories = await strapi.services.category.find({
    _limit: 999999,
  });

  const categoriesWithErraticParent = categories.filter(
    ({ parent }) => parent && !parent.id
  );

  //  Apply null parents to erratic categories
  for (let category of categoriesWithErraticParent) {
    console.info(
      `Removing parent for "${category.label_preview}" (${category.id})`
    );
    await strapi.services.category.update(
      {
        id: category.id,
      },
      { parent: null }
    );
  }

  console.info("DONE".bold.bgGreen.white);

  process.exit();
})();
