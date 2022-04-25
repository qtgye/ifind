const path = require("path");
const fs = require("fs-extra");
const pageErrorsDir = path.resolve(__dirname, "page-errors");

module.exports = () => {
  if ( fs.existsSync(pageErrorsDir) ) {
    fs.rmdirSync(pageErrorsDir, { force: true, recursive: true });
  }
}
