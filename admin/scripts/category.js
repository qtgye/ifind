const args = require("minimist")(process.argv.slice(2));
const strapi = require("./strapi-custom");

const commands = {
  "update-labels-json": async (strapiInstance) => {
    const categories = await strapiInstance.services.category.find();

    strapi.categoryChangeUpdateProducts = false;
    strapi.categoryChangeUpdateProducts = false;
    strapi.categoryChangeUpdateAttributes = false;

    // update each category
    await Promise.all(
      categories.map(async (category) => {
        await strapiInstance.query("category").update(
          { id: category.id },
          {
            label_translations_json: JSON.stringify(category.label),
          }
        );
        console.log(
          `Updated labels for category: [${category.id}] ${category.label_preview}`
        );
      })
    );
  },

  "update-products-count": async (strapiInstance) => {
    console.log("Updating product counts for categories...".cyan);
    const updatedCategories =
      await strapiInstance.services.category.updateProductCounts();
    console.log(
      ` Updated ${updatedCategories.length} categories! `.bgGreen.white.bold
    );
    process.exit();
  },
};

// Ensure a command is given
if (args._[0] in commands) {
  strapi().then(commands[args._[0]]);
}
