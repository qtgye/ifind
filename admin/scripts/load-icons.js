const path = require('path');
const ifindIconsPath = require.resolve('ifind-icons');
const copyIconsTo = require(path.resolve(ifindIconsPath, '../copy-icons-to'));

const PROJECT_ROOT = path.resolve(__dirname, '../');
const ICONS_FOLDER = path.resolve(PROJECT_ROOT, 'plugins/icons/admin/src/icons');

copyIconsTo(ICONS_FOLDER);
