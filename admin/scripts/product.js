const args = require('minimist')(process.argv.slice(2));
const strapi = require('./strapi-custom');

const commands = {

  // Runs products fixer
  'fix-products': async (strapiInstance) => {
    console.log('Fixing products...'.cyan);
    const fixedProducts = await strapiInstance.services.product.fixProducts();
    console.log(` Fixed ${fixedProducts.length} products `.bgGreen.white.bold);
  },

  // Converts categories into category, following the update for Product schema
  'singularify-categories': async (strapiInstance) => {
    const products = await strapiInstance.services.product.find({ _limit: 9999 });
    const totalProducts = products.length;
    let updatedCount = 0;

    // update each product
    for ( const product of products ) {
      try {
        await strapiInstance.query('product').update({ id: product.id}, {
          category_temp: product.categories[0] ? product.categories[0].id : null,
        });
        console.log(`[${++updatedCount} of ${totalProducts}] Updated category for product: [${product.id}] ${product.title}`.green);
      } catch (err) {
        console.error(err.message, `[${++updatedCount}} of ${totalProducts}] [${product.id}] ${product.title}`.red);
      }
    }

    console.log(' DONE '.bgGreen.white.bold);
  },

  // Assigns product.category_temp value into product.category following updates for Product schema
  'reference-category': async (strapiInstance) => {
    const products = await strapiInstance.services.product.find({ _limit: 9999 });
    const totalProducts = products.length;
    let updatedCount = 0;

    // update each product
    for ( const product of products ) {
      try {
        await strapiInstance.query('product').update({ id: product.id}, {
          category: product.category_temp || null,
        });
        console.log(`[${++updatedCount} of ${totalProducts}] Updated category for product: [${product.id}] ${product.title}`.green);
      } catch (err) {
        console.error(err.message, `[${++updatedCount}} of ${totalProducts}] [${product.id}] ${product.title}`.red);
      }
    }

    console.log(' DONE '.bgGreen.white.bold);
  },

};

// Ensure a command is given
if ( args._[0] in commands ) {
  (async () => {
    try {
      await strapi().then(commands[args._[0]]);
    } catch (err) {
      console.error(err);
    }
    process.exit();
  })();
}

