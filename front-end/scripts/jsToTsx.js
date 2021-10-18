const fs = require('fs-extra');
const glob = require("glob");
const path = require("path");

const SRC_ROOT = path.resolve(__dirname, "../src");

const jsFiles = glob.sync(
  path.resolve(
    SRC_ROOT,
    "{components,contexts,gql,templates,utilities,pages,config}",
    "**/*.js"
  )
);

jsFiles.forEach(jsFile => {
  const newFilePath = jsFile.replace(/\.js$/, '.tsx');
  fs.moveSync(jsFile, newFilePath);
  console.log(`Renamed: ${jsFile.replace(SRC_ROOT, '')} => ${newFilePath.replace(SRC_ROOT, '')}`);
});
