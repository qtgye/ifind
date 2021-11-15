/*
  Applies zip code to use German Location
  For an amazon page
*/
const screenshotPageError = require('./screenshotPageError');

const GERMAN_ZIP_CODE = 74074;
const ZIP_CODE_VALUE_SELECTOR = "#GLUXZipConfirmationValue";
const ZIP_CHANGE_POPOVER_BUTTON = "#nav-global-location-popover-link";
const ZIP_INPUT_SECTION = "#GLUXZipInputSection";
const ZIP_INPUT_INPUT = `#GLUXZipUpdateInput`;
const ZIP_INPUT_APPLY = `#GLUXZipUpdate input[type="submit"]`;
const ADDRESS_CHANGE_URL =
  "https://www.amazon.de/gp/delivery/ajax/address-change.html";

module.exports = async (browser) => {
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

  console.log('Applying German Location...'.cyan);

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

  let zipApplied = false;

  while (!zipApplied) {
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

  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("Reloading page to apply new address");
  await browser.reload();
  }
  catch (err) {
    await screenshotPageError(browser.url());
    throw err;
  }
};
