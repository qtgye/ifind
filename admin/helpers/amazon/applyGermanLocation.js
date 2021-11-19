require("colors");
const screenshotPageError = require("./screenshotPageError");

const GERMAN_ZIP_CODE = 74074;
const ZIP_CODE_VALUE_SELECTOR = "#GLUXZipConfirmationValue";
const ZIP_CHANGE_POPOVER_BUTTON = "#nav-global-location-popover-link";
const ZIP_INPUT_SECTION = "#GLUXZipInputSection";
const ZIP_INPUT_INPUT = `#GLUXZipUpdateInput`;
const ZIP_INPUT_APPLY = `#GLUXZipUpdate input[type="submit"]`;
const ADDRESS_CHANGE_URL =
  "https://www.amazon.de/gp/delivery/ajax/address-change.html";


const germanyLatLong = [51.1657, 10.4515];

module.exports = async (browser) => {
  console.log(`Applying German location...`.cyan);

  // const browserInstance = await browser.getBrowserInstance();
  // const browserContext = await browserInstance.defaultBrowserContext();
  // await browserContext.overridePermissions("https://www.amazon.de", ["geolocation"]);
  // await browser.setGeolocation({
  //   latitude: germanyLatLong[0],
  //   longitude: germanyLatLong[1],
  // });

  try {
    // Check if page is already using german location
    const usesGermanLocation = await browser.evaluate(
      (ZIP_CODE_VALUE_SELECTOR, GERMAN_ZIP_CODE) => {
        const zipCodeValueElement = document.querySelector(
          ZIP_CODE_VALUE_SELECTOR
        );

        return zipCodeValueElement
          ? zipCodeValueElement.textContent == GERMAN_ZIP_CODE
          : false;
      },
      ZIP_CODE_VALUE_SELECTOR,
      GERMAN_ZIP_CODE
    );

    if (usesGermanLocation) {
      return;
    }

    try {
      await browser.waitForSelector(ZIP_CHANGE_POPOVER_BUTTON);

      console.log("Applying German zip code...");

      // Click to show popover
      await browser.click(ZIP_CHANGE_POPOVER_BUTTON);

      await browser.waitForSelector(ZIP_INPUT_SECTION);

      // Apply zip update
      await browser.$eval(
        ZIP_INPUT_INPUT,
        (el, zipCode) => (el.value = zipCode),
        GERMAN_ZIP_CODE
      );
    } catch (err) {
      console.error(err.message.red);
      screenshotPageError(await browser.url());
      return;
    }

    let zipApplied = false;
    let tries = 3;

    while (!zipApplied && --tries) {
      try {
        await Promise.all([
          browser.click(ZIP_INPUT_APPLY),
          // Wait for address change response
          browser.waitForResponse(ADDRESS_CHANGE_URL, { timeout: 10000 }),
        ]);
        zipApplied = true;
      } catch (err) {
        console.log(err.message.red);
        console.log(`Unable to apply zip change. Retrying...`.bold);
      }
    }

    if ( !zipApplied ) {
      console.error('Unable to apply zip code');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Reloading page to apply new address");
    await browser.reload();
  } catch (err) {
    await screenshotPageError(await browser.url());
    throw err;
  }
};
