const path = require("path");
const frequencies = require("./_frequencies");

module.exports = [
  // {
  //   id: "product-validator",
  //   name: "Product Validator",
  //   schedule: frequencies.daily / 2,
  // },
  {
    id: "product-price-updater",
    name: "Product Price Updater",
    schedule: frequencies.daily,
  },
  // {
  //   id: "amazon-lightning-offers",
  //   name: "Amazon Lightning Offers",
  //   schedule: hourly,
  // },
  // {
  //   id: "ebay-wow-offers",
  //   name: "Ebay Wow Offers",
  //   schedule: frequencies.seconds * 30,
  // },
  // {
  //   id: "aliexpress-value-deals",
  //   name: "AliExpress Super Value Deals",
  //   schedule: frequencies.daily,
  // },
  // {
  //   id: 'test',
  //   name: 'Test Task',
  //   schedule: frequencies.seconds * 30,
  // },
  // {
  //   id: 'task-2',
  //   name: 'Test Task 2',
  //   schedule: frequencies.seconds * 30,
  // }
];
