const fs = require('fs');
require('../helpers/customGlobals');

const strapi = require('strapi');

// Remove build and cache folders for build script
if ( process.argv.includes('develop') ) {
  const build = resolveApp('build');
  const cache = resolveApp('.cache');
  const rmOptions = { recursive: true, force: true };

  console.log('Removing build and cache folders...');
  fs.rmdirSync(build, rmOptions);
  fs.rmdirSync(cache, rmOptions);
}

require('strapi/bin/strapi');
