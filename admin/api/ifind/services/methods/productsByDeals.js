// const dealTypes = appRequire("api/ifind/deal-types");
const offersCategories = appRequire("api/ifind/offers-categories");

const {
  all: getAllDealCategories,
} = require("../../../../helpers/scripts-server/deal-categories");
const {
  all: getAllDealTypes,
} = require("../../../../helpers/scripts-server/deal-types");

const axios = require("axios").default;
const https = require("https");
var request = require("request");

const ENV = require("dotenv").config().parsed || {};

var agentOptions;
var agent;
("use strict");

agentOptions = {
  host: "https://script.ifindilu.de",
  port: "443",
  path: "/",
  rejectUnauthorized: false,
};

agent = new https.Agent(agentOptions);

const PRODUCTS_PER_PAGE = 999999;

module.exports = async ({ deal_type = "", start = 0, offer_category = "" }) => {
  const [dealTypes, dealCategories, scheduledTasks, sources] =
    await Promise.all([
      getAllDealTypes(),
      getAllDealCategories(),
      axios
        .post("https://script.ifindilu.de/task/getTaskList")
        .then(({ data }) => data.tasks)
        .catch((err) => console.log("error ", err.message)),
      strapi.services.source.find(),
    ]);

  /**@return {string} */
  const defaultOffersCategory =
    Object.keys(dealCategories).find(
      (categoryKey) => dealCategories[categoryKey].isDefault
    ) || "";

  const offerCategory = offer_category
    ? dealCategories[offer_category]
    : dealCategories[defaultOffersCategory];
  const selectedDealTypes = offerCategory
    ? (offerCategory.dealTypes || []).reduce((dealTypesMap, dealTypeKey) => {
        if (dealTypes[dealTypeKey] && !dealTypes[dealTypeKey].disabled) {
          dealTypesMap[dealTypeKey] = dealTypes[dealTypeKey];
        }
        return dealTypesMap;
      }, {})
    : null;

  if (!selectedDealTypes) {
    return null;
  }

  const productsByDeals = await Promise.all(
    Object.entries(selectedDealTypes)
      .filter(([dealTypeKey]) => (deal_type ? dealTypeKey === deal_type : true))
      .map(async ([dealTypeKey, { site, label, nav_label, nav_icon, id }]) => {
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
        const matchedScheduledTask = scheduledTasks.find(
          ({ meta }) => meta && meta.deal_type === dealTypeKey
        );

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
            site,
            id,
          },
          products,
          total_products,
        };
      })
  );

  return productsByDeals;
};
