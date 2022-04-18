/**
 * Collects api data and generates files containing mapped data
 * from 'admin/api/ifind/data'
 */
require("colors");
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

require('../../helpers/customGlobals');

const API_ROOT = path.resolve(__dirname, "../../api/ifind");
const API_DATA_ROOT = path.resolve(API_ROOT, "data");
const API_DATA_GLOB = path.resolve(API_DATA_ROOT, "**/*.js");
const FILE_PATHS = glob.sync(API_DATA_GLOB);

const mappedData = {};

(async () => {
  FILE_PATHS.forEach((filePath) => {
    const [dataID, fileName] = filePath.split("/").slice(-2);
    const [nodeID] = fileName.split(".");

    if (!(dataID in mappedData)) {
      mappedData[dataID] = {};
    }

    mappedData[dataID][nodeID] = require(filePath);
  });

  //  Output mappedData into individual files
  Object.entries(mappedData).forEach(([dataID, data]) => {
    const dataFilePath = path.resolve(API_ROOT, `${dataID}.js`);
    const dataFileContent = `module.exports = ${JSON.stringify(
      data,
      null,
      "  "
    )}`;
    fs.outputFileSync(dataFilePath, dataFileContent);
  });

  // For each item in mappedData, apply post-processing if there is any
  await Promise.all(
    Object.keys(mappedData).map(async (dataKey) => {
      // Verify post-process file
      const postProcessFilePath = path.resolve(
        __dirname,
        "post-process",
        `${dataKey}.js`
      );

      // Run post process if exists
      if (fs.existsSync(postProcessFilePath)) {
        require(postProcessFilePath);
      }
    })
  );

  console.log(`API data extracted!`.green);
})();
