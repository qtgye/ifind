const path = require('path');
const frequencies = require('./_frequencies');

module.exports = [
  {
    id: 'product-validator',
    name: 'Product Validator',
    schedule: frequencies.daily,
  },
  {
    id: 'product-price-updater',
    name: 'Product Price Updater',
    schedule: frequencies.seconds * 30,
  },
  {
    id: 'amazon-flash-offers',
    name: 'Amazon Flash Offers',
    schedule: frequencies.hourly,
  },
  {
    id: 'ebay-wow-offers',
    name: 'Ebay Wow Offers',
    schedule: frequencies.hourly,
  },
];
