const path = require('path');
const strapi = require('strapi')
const args = require('minimist')(process.argv.slice(2));
const appRoot = process.cwd();

/**
 * Add necessary globals
 */
// Resolves given path to the root of the app
global.resolveApp = relativePath => path.resolve(appRoot, relativePath);
// Requires module from the root of the app
global.appRequire = (relativePath) => require(resolveApp(relativePath));

const strapiApp =  strapi({
  autoReload: args.autoReload || false,
});

strapiApp.start();
