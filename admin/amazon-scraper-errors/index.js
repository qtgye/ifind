const { readFileSync } = require("fs-extra");
const path = require("path");
const glob = require("glob");
const express = require("express");
const app = express();

const PORT = 5000;
const PAGE_ERRORS_ROOT = path.resolve(
  __dirname,
  "../helpers/amazon/page-errors"
);

app.use(express.static(PAGE_ERRORS_ROOT));

app.get("/amazon-page-errors", (req, res) => {
  const screenshotFiles = glob.sync(path.resolve(PAGE_ERRORS_ROOT, "**/*.png"));
  const { html, image } = req.query;

  const pagePaths = screenshotFiles.map((filePath) => {
    const pagePath = filePath
      .replace(PAGE_ERRORS_ROOT, "")
      .replace(/index\.png$/, "");
    return pagePath;
  });

  const encodedHtml = encodeURI(html || '');
  const encodedImage = encodeURI(image || '');

  if (encodedHtml && pagePaths.includes(encodedHtml)) {
    res.send(
      readFileSync(
        path.resolve(PAGE_ERRORS_ROOT, encodedHtml.replace(/^\//, ""), "index.html")
      ).toString()
    );
  } else if (encodedImage && pagePaths.includes(encodedImage)) {
    res.sendFile(
      path.resolve(PAGE_ERRORS_ROOT, encodedImage.replace(/^\//, ""), "index.png")
    );
  } else {
    res.send(`
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        font-family: sans-serif;
        text-align: left;
      }
      table {
        table-layout: auto;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 5px;
        white-space: nowrap;
      }
      th {
        border-bottom: 1px solid #eee;
      }
      tr:hover td {
        background-color: #eee;
      }
    </style>
    <table>
      <thead>
        <tr>
          <th>Path</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${pagePaths.map(
          (pagePath) => `
          <tr>
            <td>
              <a href="//amazon.de${pagePath.replace(/\/_test/, '')}" target="_blank">
                ${pagePath}
              </a>
            </td>
            <td><a href="${req.path}?html=${pagePath}" target="_blank">HTML</a></td>
            <td><a href="${req.path}?image=${pagePath}" target="_blank">Screenshot</a></td>
          </tr>
        `
        ).join('')}
      </tbody>
    </table>
  `);
  }
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
