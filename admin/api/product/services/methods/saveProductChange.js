const moment = require("moment");
const productChangeSettings = appRequire(
  "api/product-change/models/product-change.settings.json"
);
const defaultChangeType = productChangeSettings.attributes.change_type.default;

/**
 * Creates a new ProductChange entry following a product's update
 * @param {ID} id
 * @param {String} changeType - create|update|admin_update|publish|trash|category_post_update
 * @returns void
 */
module.exports = async (
  id,
  changeType = strapi.productChangeType || defaultChangeType
) => {
  const date_time = moment.utc().toISOString();
  const admin_user = strapi.admin_user;
  const state = strapi.productChangedData;
  let change_type = changeType;

  // Delete unnecessary temporary data
  delete strapi.productChangedData;
  delete strapi.admin_user;
  delete strapi.productChangeType;

  // No need to save to history if there's no changes
  if (!state) {
    return;
  }

  // Determine change_type
  if (changeType !== "create") {
    if ("status" in state) {
      change_type = "publish";
    }
  }

  await strapi.query("product-change").create({
    state,
    date_time,
    admin_user,
    product: id,
    change_type,
  });
};
