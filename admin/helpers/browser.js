/**
 * Leverages Puppeteer
 */
require('colors');
const puppeteer = require('puppeteer');

class Browser {
  constructor() {}

  async getBrowserInstance() {
    this.resetBrowserIdleWatcher();

    if ( !this.browser ) {
      console.log('Creating a puppeteer browser instance...'.cyan);

      const browser = await puppeteer.launch();
      console.log('Browser instance created'.cyan);
      this.browser = this.browser || browser;
    }

    return this.browser;
  }

  async getPageInstance() {
    this.resetBrowserIdleWatcher();

    if ( !this.page ) {
      const browser = await this.getBrowserInstance();
      this.page = await browser.newPage();
    }

    return this.page;
  }

  /**
   *
   * @param {String} url
   * @param {String} waitForSelector
   * @returns Page instance
   */
  async goTo(url, waitForSelector = 'body') {
    const page = await this.getPageInstance();
    await page.goto(url);
    await page.waitForSelector(waitForSelector);
    return page;
  }

  async getHtml() {
    const page = await this.page;
    const bodyHtml = await page.$eval('body', (el) => el.innerHTML);
    return bodyHtml;
  }

  // Watches for browser idle
  // If this.getPageInstance or this.getBrowserInstance
  // have not been called around 1min, then this
  // invalidates the puppeteer instance to avoid memory leak
  async resetBrowserIdleWatcher() {
    if ( this.browserIdleTimer ) {
      clearTimeout(this.browserIdleTimer);
    }

    this.browserIdleTimer = setTimeout(async () => {
      console.log('Browser has been idle, closing instance...'.cyan);
      const browser = await this.browser;
      browser.close(); // no need to await
      this.page = null;
      this.browser = null;
    }, 1000 * 60);
  }
}

module.exports = new Browser;
