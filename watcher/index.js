require('babel-register');
require('babel-polyfill');

const cfg = require('./config.json');

require('./src/watcher').default(cfg.xmlPath);
