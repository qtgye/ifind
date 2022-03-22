const fs = require("fs-extra");
const offerCategories = appRequire("api/ifind/offers-categories");

const productModelFilePath = resolveApp(
  "api/product/models/product.settings.json"
);
const productConfig = JSON.parse(
  fs.readFileSync(productModelFilePath).toString()
);

// Apply deal types
productConfig.attributes.offer_category.enum = ["none", ...Object.keys(offerCategories)];

// Output updated product model
fs.outputFileSync(
  productModelFilePath,
  JSON.stringify(productConfig, null, "  ")
);
