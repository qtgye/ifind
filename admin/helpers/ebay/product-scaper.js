const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { getDetailsFromURL } = require("./api");

const scapeProduct = async (productURL, language = "de") => {
  const [apiData, pageData] = await Promise.all([
    getDetailsFromURL(productURL),
    extractPageData(productURL, language),
  ]);

  return {
    ...apiData,
    price_original: pageData.price_original,
    discount_percent:
      apiData.discount_percent || pageData.discount_percent || null,
  };
};

const extractPageData = async (productURL, language = "de") => {
  const document = await getProductPageDOM(productURL);

  if (document) {
    const titleElement = document.querySelector(".x-item-title__mainTitle");
    const priceElement = document.querySelector("#prcIsum");
    const originalPriceElement = document.querySelector(".vi-originalPrice");
    const discountElement = document.querySelector("#vi-discountValue");

    return {
      title: titleElement ? titleElement.textContent.trim() : null,
      price: priceElement
        ? normalizePriceValue(priceElement.textContent.trim(), language)
        : null,
      price_original: originalPriceElement
        ? normalizePriceValue(originalPriceElement.textContent.trim(), language)
        : null,
      discount_percent: discountElement
        ? Number(discountElement.textContent.trim())
        : null,
    };
  }

  return null;
};

const normalizePriceValue = (priceText, language = "de") => {
  const priceTextSanitized = priceText.replace(/[^0-9,.]+/gi, "");

  switch (language) {
    // Euros
    case "de":
      return Number(
        priceTextSanitized.replace(/[,.]/g, (match) =>
          match === "," ? "." : ","
        )
      );
    default:
      return priceTextSanitized;
  }
};

const getProductPageDOM = async (productURL) => {
  try {
    const response = await fetch(productURL);
    const body = await response.text();
    const {
      window: { document },
    } = new JSDOM(body);

    return document;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  scapeProduct,
};
