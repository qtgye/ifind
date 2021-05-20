const path = require('path');
const appRoot = process.cwd();

/**
 * Add necessary globals
 */

// Resolves given path to the root of the app
global.resolveApp = relativePath => path.resolve(appRoot, relativePath);

// Requires module from the root of the app
global.appRequire = (relativePath) => require(resolveApp(relativePath));
