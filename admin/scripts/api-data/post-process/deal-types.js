const fs = require("fs-extra");
const dealTypes = appRequire("api/ifind/deal-types");

const productModelFilePath = resolveApp(
  "api/product/models/product.settings.json"
);
const productConfig = JSON.parse(
  fs.readFileSync(productModelFilePath).toString()
);

// Apply deal types
productConfig.attributes.deal_type.enum = ["none", ...Object.keys(dealTypes)];

// Output updated product model
fs.outputFileSync(
  productModelFilePath,
  JSON.stringify(productConfig, null, "  ")
);
