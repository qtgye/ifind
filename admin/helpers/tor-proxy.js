/**
 * PREREQUISITE:
 * - Tor service configured as proxy server (source: https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc)
 * - Tor config set to german country (source: https://ab-kotecha.medium.com/how-to-connect-from-a-specific-country-without-any-vpn-but-privately-enough-through-tor-browser-5dc2d45043b)
 */

require("colors");
const { existsSync, readFileSync } = require("fs-extra");
const puppeteer = require("puppeteer");

// Parse Tor config file path provided in the .env
const { TORRC_PATH } = require("dotenv").config().parsed;

if (!TORRC_PATH || !existsSync(TORRC_PATH)) {
  throw new Error(
    `Tor config file path is not given. Please provide TORRC_PATH in env file.`
  );
}

// Parse socksport configuration from the torrc file
const portsConfig = readFileSync(TORRC_PATH)
  .toString()
  .match(/socksport\s+\d+/gi);
const availablePorts = portsConfig
  .map((portConfig) => portConfig.split(/\s+/)[1])
  .filter(Boolean);

class TorProxy {
  /**
   * Creates a new instance of this class
   */
  static create() {
    return new TorProxy();
  }

  /**
   * Generates a new page using the current browser
   * @return Puppeteer Page
   */
  async newPage(newBrowser = false) {

    /* Ensure a browser instance is present */
    if (!this.browser) {
      await this.launchNewBrowser();
    }

    /* Close all other pages/tabs */
    this.closePages();

    /* Log */
    console.info(`Getting new page.`);

    /* Create new Page */
    const page = await this.browser.newPage();

    /* Apply desktop breakpoint */
    await page.setViewport({
      width: 1920,
      height: 3000,
    });

    /* Return new page */
    return page;
  }

  /**
   * Launches a new browser with proxy settings
   */
  async launchNewBrowser() {

    /* Get proxy */
    const proxy = this.generateProxy();

    /* Close existing browser if there is any */
    console.log(`Closing existing browser...`);
    if ( this.browser && this.browser.disconnect ) {
      await this.browser.disconnect();
    }

    /* Log */
    console.info(`Launching new browser using proxy: ${proxy.bold}`);

    /* Launching browser */
    this.browser = await puppeteer.launch({
      args: [`--proxy-server=${proxy}`, "--no-sandbox"],
    });

    /* Nullify reference to browser if disconnected */
    this.browser.on("disconnected", () => {
      this.browser = null;
    });
  }

  /**
   * Generates a proxy to be used for the Puppeteer browser launch
   * e.g., socks5://127.0.0.1:9050
   * @returns String ()
   */
  generateProxy() {
    const port = this.getSocksPort();
    return `socks5://127.0.0.1:${port}`;
  }

  /**
   * Selects a port from the Torrc SocksPorts list
   * @returns Number
   */
  getSocksPort() {
    const randomIndex = Math.round(Math.random() * (availablePorts.length - 1));
    return availablePorts[randomIndex];
  }

  /**
   * Close all current pages
   */
  async closePages() {
    const pages = await this.browser.pages();
    await Promise.all(pages.map((page) => page.close()));
  }
}

module.exports = () => TorProxy.create();
