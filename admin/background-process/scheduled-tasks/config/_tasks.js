const path = require('path');
const frequencies = require('./_frequencies');

module.exports = [
  {
    id: 'product-validator',
    name: 'Product Validator',
    schedule: frequencies.daily / 2,
  },
  {
    id: 'product-price-updater',
    name: 'Product Price Updater',
    schedule: frequencies.seconds / 2,
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
  {
    id: 'test-task',
    name: 'Test Task',
    schedule: frequencies.hourly,
  },
];
