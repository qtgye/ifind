const path = require("path");
const { getWowOffers, getMultipleFromIDs } = require('./api');
const ebayLink = require('./ebayLink');
const createStrapiInstance = require("../../scripts/strapi-custom");

const EBAY_DEAL_TYPE = 'ebay_wow_offers';

const getEbayWowOffers = async () => {
  const strapi = await createStrapiInstance();
  const [ebaySource, germanRegion] = await Promise.all([
    strapi.services.source.findOne({ name_contains: "ebay" }),
    strapi.services.region.findOne({ code: "de" }),
  ]);

  try {
    console.log('Getting Ebay Wow Offers...');

    const fetchedOffers = [];
    let page = 1;

    while ( fetchedOffers.length < 20 ) {
      console.log(`Fething page ${page}...`);

      const offset = page - 1;
      const productDeals = await getWowOffers(100, offset);

      for ( const productDeal of productDeals ) {
        // Append sanitized product data
        fetchedOffers.push({
          itemID: productDeal.itemID,
          title: productDeal.title,
          image: productDeal.image,
          url: productDeal.url,
          price: productDeal.price,
          price_original: productDeal.price_original,
          discount_percent: productDeal.discount_percent,
          // url_list: [{
          //   url: productDeal.url,
          //   price: productDeal.price,
          //   price_original: productDeal.price_original,
          //   discount_percent: productDeal.discount_percent,
          //   quantity_total: additionalProductDetails.quantity_total,
          //   quantity_available: productDeal.quantity_total - additionalProductDetails.quantity_sold,
          //   source: ebaySource.id,
          //   region: germanRegion.id,
          // }]
        });

        if ( fetchedOffers.length >= 20 ) {
          break;
        }
      }

      page++;
    }

    console.log('Getting additional details...');

    // Get quantity details (not available from Deals API)
    const itemIDs = fetchedOffers.map(({ itemID }) => itemID);
    const additionalProductDetails = await getMultipleFromIDs(itemIDs);

    let savedProducts = 0;

    // Remove old products
    console.log("Removing old products...".green);
    const deletedProducts = await strapi.services.product.delete({ deal_type: EBAY_DEAL_TYPE });
    console.log(`Deleted ${deletedProducts.length} product(s).`.cyan);

    // Create sanitized product data
    // Merging details from deals and additionalDetails
    // Then save products
    for ( const productOfferData of fetchedOffers ) {
      const additionalDetails = additionalProductDetails[productOfferData.itemID];

      // Sanitized product data
      if ( additionalDetails ) {
        const newProductData = {
          website_tab: "home",
          deal_type: EBAY_DEAL_TYPE,
          title: productOfferData.title,
          image: productOfferData.image,
          url_list: [{
            source: ebaySource.id,
            region: germanRegion.id,
            url: ebayLink(productOfferData.url),
            price: productOfferData.price,
            price_original: productOfferData.price_original,
            discount_percent: productOfferData.discount_percent,
            quantity_total: additionalDetails.quantity_total,
            quantity_available: additionalDetails.quantity_total - additionalDetails.quantity_sold,
          }],
        };

        // Save new product
        await strapi.services.product.create(newProductData);
        console.log(`[ ${++savedProducts} of ${fetchedOffers.length} ] Saved new product: ${newProductData.title}`.green);
      }
    }

    console.log(" DONE ".white.bgGreen);
  } catch (err) {
    console.error(err.message.red, err.stack);
    await page.screenshot({
      path: path.resolve(__dirname, "test.png"),
    });
  }
};

(async () => {
  await getEbayWowOffers();
  process.exit();
})();

module.exports = getEbayWowOffers;
