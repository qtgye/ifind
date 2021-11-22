/**
 * PREREQUISITE:
 * - Tor service configured as proxy server (source: https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc)
 * - Tor config set to german country (source: https://ab-kotecha.medium.com/how-to-connect-from-a-specific-country-without-any-vpn-but-privately-enough-through-tor-browser-5dc2d45043b)
 */
require('colors');
const { existsSync, readFileSync } = require("fs-extra");
const puppeteer = require("puppeteer");
const { TORRC_PATH } = require("dotenv").config().parsed;

if (!TORRC_PATH || !existsSync(TORRC_PATH)) {
  throw new Error(
    `Tor config file path is not given. Please provide TORRC_PATH in env file.`
  );
}

const portsConfig = readFileSync(TORRC_PATH)
  .toString()
  .match(/socksport\s+\d+/gi);
const availablePorts = portsConfig
  .map((portConfig) => portConfig.split(/\s+/)[1])
  .filter(Boolean);

const getProxiedBrowserPage = async () => {
  const randomIndex = Math.round(
    Math.random() * (availablePorts.length - 1)
  );

  const port = availablePorts[randomIndex] ;
  const proxy = `--proxy-server=socks5://127.0.0.1:${port}`;

  console.log(`\nLanching browser using Tor Proxy port: ${port.bold}`)

  const browser = await puppeteer.launch({
    args: [proxy, '--no-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 3000,
  });

  return page;
};

module.exports = {
  getProxiedBrowserPage,
};
