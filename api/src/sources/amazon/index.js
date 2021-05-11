const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const BASE_URL = 'https://www.amazon.de';

const buildFullURL = (relativeURL) => `${BASE_URL}${relativeURL}`;
const buildBestSellersURL = (category) => buildFullURL(`/gp/bestsellers/${category || ''}`);

const getBestSellers = async (category) => {
  const url = buildBestSellersURL(category);
  const resp = await fetch(url);
  const body = await resp.text();
  const { window } = new JSDOM(body);
  const { document } = window;

  const [...items] = document.querySelectorAll('#zg-ordered-list .a-list-item');

  const exractImageElementData = (imageElement) => {
    const alt = imageElement.getAttribute('alt');
    const src = imageElement.getAttribute('src');

    return {
      alt,
      sizes: {
        small: src.replace(/AC_UL200_SR200,200/, 'AC_UL500_SR500,500'),
        thumbnail: src.replace(/AC_UL200_SR200,200/, 'AC_UL800_SR800,800'),
        large: src.replace(/AC_UL200_SR200,200/, 'AC_UL120000_SR120000,120000'),
      }
    };
  }

  return Promise.all(items.slice(0, 5).map(async item => {
    const link = item.querySelector('a');
    const title = link.textContent.trim();
    const detailURL = buildFullURL(link.href);
    const image = exractImageElementData(item.querySelector('img'));

    return {
      // // id: String
      image,
      title,
      detailURL
    }
  }))
}

module.exports = {
  getBestSellers,
};