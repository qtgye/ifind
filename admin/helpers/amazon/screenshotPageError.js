const path = require('path');
const fs = require('fs-extra');
const browser = require('../browser');

const screenshotPageError = async (url) => {
  const pageHTML = await browser.evaluate(
    () => document.documentElement.innerHTML
  );
  const [urlPath] = decodeURIComponent(url).split("?");
  const directoryTree = urlPath.replace(/^.+amazon[^/]+\//i, "").split("/");
  const dirPath = path.resolve(__dirname, "page-errors", ...directoryTree);
  fs.ensureDirSync(dirPath);
  await browser.screenshot({ path: path.resolve(dirPath, "index.png") });
  fs.outputFileSync(path.resolve(dirPath, "index.html"), pageHTML);
};

module.exports = screenshotPageError;
