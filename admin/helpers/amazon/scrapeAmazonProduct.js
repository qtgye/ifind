const path = require('path');
const fs = require('fs-extra');

const fetch = require('node-fetch');
const moment = require('moment');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('../url');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Allow each request to use a random user agent
// To avoid getting blocked by Amazon
USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
];

const priceSelector = [
  '#price_inside_buybox',
  '#priceblock_ourprice',
  '#priceblock_dealprice',
  '[data-action="show-all-offers-display"] .a-color-price',
  '#usedOnlyBuybox .offer-price',
  '#olp_feature_div .a-color-price',
].join(',');
const imageSelector = '#landingImage[data-a-dynamic-image]';
const titleSelector = '#title';
const additionalInfoTableSelector = '#productDetails_detailBullets_sections1';
const detailsListSelector = '#detailBullets_feature_div';

const detailSelector = '#centerCol';
const selectorsToRemove = [
  '#title',
  '#mars-pav-widget',
  '#desktop_unifiedPrice',
  '#unifiedPrice_feature_div',
  '#averageCustomerReviews_feature_div',
  '#ask_feature_div',
  '#variation_configuration [role="radiogroup"]',
  '#variation_style_name [role="radiogroup"]',
  '#variation_color_name [role="radiogroup"]',
  '#productSupportAndReturnPolicy_feature_div',
  '#poToggleButton',
  '#alternativeOfferEligibilityMessaging_feature_div',
  '#valuePick_feature_div',
  '#olp_feature_div',
  '#seeMoreDetailsLink',
  '#HLCXComparisonJumplink_feature_div',
  '.caretnext',
  '#productAlert_feature_div',
  '#atfCenter16_feature_div',
  'style',
  'script',
];

const scrapeAmazonProduct = async (productURL, language = 'de', scrapePriceOnly = false) => {
  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  // Scrape for all amazon details if applicable
  if ( !scrapePriceOnly ) {
    const response = await fetch(urlWithLanguage, { headers: {
      origin: urlWithLanguage,
      referer: urlWithLanguage,
      'User-Agent': USER_AGENTS[ Math.floor(Math.random() * ( USER_AGENTS.length)) ]
    }});
    const detailPageHTML = await response.text();

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
    scrapedData.title = titleElement ? titleElement.textContent.trim().replace(/\n/, '') : '';
    scrapedData.image = highResImage ? highResImage[0] : '';

    // Apply details_html
    scrapedData.details_html = detailElement.outerHTML.trim().replace(/\n+/g, '\n');
  }

  // Go to english site for price and release_date
  const englishSiteResponse = await fetch(englishPageURL, { headers: {
    'origin': englishPageURL,
    'referer': englishPageURL,
    'User-Agent': USER_AGENTS[ Math.floor(Math.random() * ( USER_AGENTS.length)) ],
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
  } });


  const englishPageHTML = await englishSiteResponse.text();
  const dom = new JSDOM(englishPageHTML);

  // This might be a server error
  // So we won't be able to get product data
  // But we don't want to flag this as a product issue.
  // We'll leave the product data as is.
  if ( englishSiteResponse.status >= 500 ) {
    fs.outputFileSync( path.resolve(__dirname, 'page-errors', englishPageURL + '.html'), englishPageHTML);
    console.error(`Error ${englishSiteResponse.status} : ${englishSiteResponse.statusText}`);
    return true;
  }

  if ( englishSiteResponse.status >= 400 ) {
    throw new Error(`Unable to parse price for the product from Amazon. Error ${englishSiteResponse.status} : ${englishSiteResponse.statusText}`);
  }

  // Get the price
  const priceElement = dom.window.document.querySelector(priceSelector);
  const priceMatch = priceElement && priceElement.textContent.match(/[0-9.,]+/);

  // Product must be unavailable if there's no price parsed
  if ( !priceMatch ) {
    fs.outputFileSync( path.resolve(__dirname, 'page-errors', englishPageURL + '.html'), englishPageHTML);
    throw new Error("Unable to parse price for the product from Amazon. Please make sure that it's currently available: " + englishPageURL);
  }

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

    if ( releaseDateString ) {
      const [ day, monthAbbrev, year ] = releaseDateString.split(' ');
      const isoDate = [ year, MONTHS.indexOf(monthAbbrev.substr(0, 3)), day ];

      const releaseDateMoment = moment.utc(isoDate);
      const releaseDate = releaseDateMoment ? releaseDateMoment.toISOString() : '';

      if ( releaseDate ) {
        scrapedData.releaseDate = releaseDate;
      }
    }
  }

  return scrapedData;
}

module.exports = scrapeAmazonProduct;
