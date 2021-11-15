const path = require('path');
const glob = require('glob');
const express = require('express');
const app = express();

const PORT = 5000;
const PAGE_ERRORS_ROOT = path.resolve(__dirname, '../helpers/amazon/pare-errors');

app.use(express.static(PAGE_ERRORS_ROOT));

app.get('/', (req, res) => {
  const screenshotFiles = glob.sync(path.resolve('PAGE_ERRORS_ROOT', '**/*.png'));
  console.log({ screenshotFiles });
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
