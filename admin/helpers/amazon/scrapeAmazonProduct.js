const fetch = require('node-fetch');
const moment = require('moment');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('../url');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const fetchHeaders = {
  'origin': 'https://www.amazon.de',
  'referer': 'https://www.amazon.de',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
};

const priceSelector = '#priceblock_ourprice, [data-action="show-all-offers-display"] .a-color-price';
const imageSelector = '#landingImage[data-a-dynamic-image]';
const titleSelector = '#title';
const additionalInfoTableSelector = '#productDetails_detailBullets_sections1';
const detailsListSelector = '#detailBullets_feature_div';

const detailSelector = '#centerCol';
const selectorsToRemove = [
  '#title',
  '#desktop_unifiedPrice',
  '#productSupportAndReturnPolicy_feature_div',
  '#alternativeOfferEligibilityMessaging_feature_div',
  '#olp_feature_div',
  '#seeMoreDetailsLink',
  '#HLCXComparisonJumplink_feature_div',
  '.caretnext',
];

const scrapeAmazonProduct = async (productURL, language = 'de', scrapePriceOnly = false) => {
  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  // Scrape for all amazon details if applicable
  if ( !scrapePriceOnly ) {
    const response = await fetch(urlWithLanguage, { headers: fetchHeaders });
    const detailPageHTML = await response.text();

    console.log('Page parsed');

    const dom = new JSDOM(detailPageHTML);
    const titleElement = dom.window.document.querySelector(titleSelector);
    const imageElement = dom.window.document.querySelector(imageSelector);
    const detailElement = dom.window.document.querySelector(detailSelector);

    // Select highres image from dynamic image data
    const imageData = scrapedData.image = imageElement ? JSON.parse(imageElement.dataset.aDynamicImage) || {} : {};
    const highResImage = Object.entries(imageData).reduce((selectedEntry, [ url, dimensions ]) => (
      !selectedEntry ? [ url, dimensions ]
        : dimensions[0] > selectedEntry[1][0] ? [ url, dimensions ]
          : selectedEntry
    ), null);

    // Remove unnecessary elements from detail section
    const allSelectorsToRemove = selectorsToRemove.join(',');
    [...detailElement.querySelectorAll(allSelectorsToRemove)].forEach(element => {
      try {
        element.remove();
      }
      catch (err) { /**/ }
    });

    // Apply scraped details
    scrapedData.title = titleElement ? titleElement.textContent.trim() : '';
    scrapedData.image = highResImage ? highResImage[0] : '';
    scrapedData.details_html = detailElement.outerHTML.trim();
  }

  // Go to english site for price and release_date
  const englishSiteResponse = await fetch(englishPageURL, { headers: fetchHeaders });
  const englishPageHTML = await englishSiteResponse.text();
  const dom = new JSDOM(englishPageHTML);

  // Get the price
  const priceElement = dom.window.document.querySelector(priceSelector);
  const priceMatch = priceElement && priceElement.textContent.match(/[0-9.,]+/);
  scrapedData.price = priceMatch && priceMatch[0].replace(',', '') || 0;

  // Get the release date if applicable
  if ( !scrapePriceOnly ) {
    const parsedReleaseDates = [
      // Some products have additional info table,
      (() => {
        const additionalInfoTable = dom.window.document.querySelector(additionalInfoTableSelector);
        if ( !additionalInfoTable ) return;
        const releaseDateRow = Array.from(additionalInfoTable.rows).find(row => (
          row.cells[0] && /date first available/i.test(row.cells[0].textContent)
        ));
        return releaseDateRow && releaseDateRow.cells[1] ? releaseDateRow.cells[1].textContent.trim() : '';
      })(),
      // Some products have details list
      (() => {
        const detailsListContainer = dom.window.document.querySelector(detailsListSelector);
        if ( !detailsListContainer ) return;
        const releaseDateItemText = [...detailsListContainer.querySelectorAll('.a-list-item')].map(listItem => (
          listItem.textContent
        )).find(textContent => /date first available/i.test(textContent));
        const dateMatch = releaseDateItemText ? releaseDateItemText.match(/[0-9]+[^0-9]+[0-9]{4}/i) : null;
        return dateMatch ? dateMatch[0] : null;
      })(),
    ];

    const releaseDateString = parsedReleaseDates.find(date => date);

    if ( !releaseDateString ) {
      return;
    }

    const [ day, monthAbbrev, year ] = releaseDateString.split(' ');
    const isoDate = [ year, MONTHS.indexOf(monthAbbrev.substr(0, 3)), day ];

    const releaseDateMoment = moment.utc(isoDate);
    const releaseDate = releaseDateMoment ? releaseDateMoment.toISOString() : '';

    if ( releaseDate ) {
      scrapedData.releaseDate = releaseDate;
    }
  }

  return scrapedData;
}

module.exports = scrapeAmazonProduct;
