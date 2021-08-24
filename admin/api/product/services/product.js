"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  productComparisonList: require("./methods/productComparisonList"),
  getProductDetails: require("./methods/getProductDetails"),
  addProductClick: require("./methods/addProductClick"),
  fixProducts: require("./methods/fixProducts"),
  updateProductLinks: require("./methods/updateProductLinks"),
  productsList: require("./methods/productsList"),
  preProcessProductData: require("./methods/preProcessProductData"),
  saveProductChange: require("./methods/saveProductChange"),
  applyProductCategoryUpdates: require("./methods/applyProductCategoryUpdates"),
  publishProducts: require("./methods/publishProducts"),
  updateProduct: require("./methods/updateProduct"),
  validateProducts: require("./methods/validateProducts"),
};
