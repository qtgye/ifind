const adminConfig = require("./admin/ecosystem.config");
const iconsConfig = require("./ifind-icons/ecosystem.config");

module.exports = {
  apps: [...adminConfig.apps, ...iconsConfig.apps],
};
