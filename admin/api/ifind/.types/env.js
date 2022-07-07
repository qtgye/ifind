const ENV = require('dotenv').config().parsed || {};
const envKeys = Object.keys(ENV);

module.exports = `
  type EnvType {
    ${envKeys.map(key => `${key}: String`).join('\n')}
  }
`
