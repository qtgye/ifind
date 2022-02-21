require("colors");
const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname);
const ICONS_ROOT = path.resolve(PROJECT_ROOT, "src/icons");

module.exports = (destinationFolder) => {
  console.info(`Copying icons...`.green.bold);

  glob.sync(path.resolve(ICONS_ROOT, '**/*.svg')).forEach(filePath => {
    const [ fileName ] = filePath.split('/').slice(-1);
    fs.copyFileSync(filePath, path.resolve(destinationFolder, fileName));
  });

  console.info(`DONE`.green.bold);
}
