/**
 * Removes references to non-existing languages
 */
const createStrapiInstance = require("./strapi-custom");

(async () => {
  const strapi = await createStrapiInstance();
  const [languages, categories, tags] = await Promise.all([
    strapi.services.language.find(),
    strapi.services.category.find({ _limit: 999999 }),
    strapi.services.tag.find(),
  ]);

  // Existing Language IDs
  const languagesIDs = languages.map(({ id }) => id);

  console.log(`Processing ${categories.length} categories...`);
  let categoriesProcessed = 0;

  for (let category of categories) {
    const labelsToRetain = category.label
      .filter(
        ({ language }) => language && languagesIDs.includes(language.id)
      )
      .map((label) => ({
        label: label.label,
        language: label.language.id,
      }));

    await strapi.services.category.update(
      { id: category.id },
      {
        label: labelsToRetain,
      }
    );

    process.stdout.write(
      `\rProcessed ${++categoriesProcessed} of ${categories.length}`
    );
  }

  console.log("");

  process.exit();
})();
