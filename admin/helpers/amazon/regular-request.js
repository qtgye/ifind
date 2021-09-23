const path = require('path');
const fs = require('fs-extra');
const fetch = require("node-fetch");
const { JSDOM } = require('jsdom');

// Allow each request to use a random user agent
// To avoid getting blocked by Amazon
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
  "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
];

module.exports = async (url) => {
  const availableUAs = [...USER_AGENTS];
  let body;

  // Cycle through all available user agents until we get a response
  while (availableUAs.length) {
    try {
      console.log(" - Fetching...");
      const userAgent = availableUAs.shift();
      const response = await fetch(url, {
        headers: {
          origin: url,
          referer: url,
          "User-Agent": userAgent,
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9,la;q=0.8,fil;q=0.7',
          'cache-control': 'max-age=0',
          'rtt': '50',
          'sec-ch-ua': '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
        },
      });

      // Request must have been blocked
      if (response.status >= 400) {
        console.log(`Error ${response.status}: ${response.statusText}`);
        continue;
      }

      const bodyHTML = await response.text();
      const dom = new JSDOM(bodyHTML);

      if  ( dom.window.document.querySelector('#centerCol') ) {
        body = bodyHTML;
        break;
      }

      fs.outputFileSync(path.resolve(__dirname, 'test.html'), bodyHTML);
      continue;

    } catch (err) {
      console.error(err.stack);
      continue;
    }
  }

  if (body) {
    return body;
  }

  // All user agents have been used up but no response was received
  throw new Error(`Unable to parse data for the product URL: ${url}`);
};
