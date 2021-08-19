const strapi = require("./strapi-custom");
const { setProductChangeParams } = appRequire('helpers/redux');
const { getState } = appRequire('helpers/redux');

const test = async strapiInstance => {
  setTimeout(() => {
    const { productChange } = getState();
    console.log(productChange.productChangeParams);
  }, 500);
}

strapi().then(test);
