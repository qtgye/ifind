require("colors");
const fs = require("fs-extra");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname);
const ICONS_ROOT = path.resolve(PROJECT_ROOT, "src/icons");

module.exports = (destinationFolder) => {
  console.info(`Copying icons...`.green.bold);
  fs.copySync(ICONS_ROOT, destinationFolder, { recursive: true });
  console.info(`DONE`.green.bold);
}
