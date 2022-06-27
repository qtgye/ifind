const dealTypes = appRequire("api/ifind/deal-types");
const offersCategories = appRequire("api/ifind/offers-categories");
const axios = require('axios').default;
const https = require('https');
var request = require('request');
var agentOptions;
var agent;
'use strict';

agentOptions = {
  host: 'https://script.ifindilu.de'
, port: '443'
, path: '/'
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

const PRODUCTS_PER_PAGE = 999999;

module.exports = async ({ deal_type = "", start = 0, offer_category = "" }) => {
  const sources = await strapi.services.source.find();
  // const scheduledTasks = await strapi.scheduledTasks.list();
  // const scheduledTasks = null
  let scheduledTasks = null;
    await axios.post("https://script.ifindilu.de/task/getTaskList")
      .then((response) => {
         scheduledTasks = response.data.tasks
      })
      .catch((err) => console.log("error ", err.message))

  console.log("scheduledTasks",scheduledTasks)
  

  const defaultOffersCategory = Object.keys(offersCategories).find(
    (categoryKey) => offersCategories[categoryKey].isDefault
  );

  console.log("defaultOffersCategory",defaultOffersCategory)
  const offerCategory = offer_categorys
    ? offersCategories[offer_category]
    : offersCategories[defaultOffersCategory];
  const selectedDealTypes = offerCategory
    ? offerCategory.dealTypes.reduce((dealTypesMap, dealTypeKey) => {
        dealTypesMap[dealTypeKey] = dealTypes[dealTypeKey];
        return dealTypesMap;
      }, {})
    : null;

  console.log({ offerCategory });

  if (!selectedDealTypes) {
    return null;
  }

  const productsByDeals = await Promise.all(
    Object.entries(selectedDealTypes)
      .filter(([dealTypeKey]) => (deal_type ? dealTypeKey === deal_type : true))
      .map(async ([dealTypeKey, { site, label, nav_label, nav_icon }]) => {
        const [products, total_products] = await Promise.all([
          strapi.services.product.find({
            deal_type: dealTypeKey,
            _limit: PRODUCTS_PER_PAGE,
            _start: start,
            _sort:
              "deal_quantity_available_percent:ASC,quantity_available_percent:ASC",
          }),
          strapi.services.product.count({
            deal_type: dealTypeKey,
          }),
        ]);

        const source = sources.find(({ name }) =>
          new RegExp(site, "i").test(name)
        );
        // for(const product of products){
        // console.log("Products -->", product.url_list);
        // }
        // console.log("TotalProducts -->", total_products);
        // Get last run data from scheduled task
        const matchedScheduledTask = scheduledTasks.find(
          ({ meta }) => meta && meta.deal_type === dealTypeKey
        );

        console.log("matchedScheduledTask",matchedScheduledTask)
        const last_run = matchedScheduledTask
          ? matchedScheduledTask.last_run
          : null;

        return {
          deal_type: {
            name: dealTypeKey,
            label,
            source,
            last_run,
            nav_label,
            nav_icon,
          },
          products,
          total_products,
        };
      })
  );

  return productsByDeals;
};
