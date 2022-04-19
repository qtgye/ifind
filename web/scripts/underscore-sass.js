const path = require("path");
const glob = require("glob");
const fs = require("fs-extra");

const stylesheets = glob.sync(
  path.resolve(__dirname, "../src/components", "**/*.scss")
);

stylesheets.forEach((file) => {
  const nonModuleFilename = file.replace(/\.module/g, "");
  const filePathSegments = nonModuleFilename.split(/[\\/]/);
  const fileName = filePathSegments.pop();
  const underscoredFilename = `_${fileName}`;
  const newFilePath = [...filePathSegments, underscoredFilename].join("/");
  fs.renameSync(file, newFilePath);
});
