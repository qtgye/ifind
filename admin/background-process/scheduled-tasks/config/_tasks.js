const frequencies = require('./_frequencies');

module.exports = [
  {
    id: 'product-validator',
    name: 'Product Validator',
    // schedule: frequencies.daily,
    test: 123,
  },
  {
    id: 'product-price-updater',
    name: 'Product Price Updater',
    schedule: frequencies.daily,
  },
  {
    id: 'amazon-flash-offers',
    name: 'Amazon Flash Offers',
    schedule: 'hourly',
  },
  {
    id: 'ebay-wow-offers',
    name: 'Ebay Wow Offers',
    schedule: frequencies.hourly,
  },
];
