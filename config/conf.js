const path = require('path');

const DLIENT_PORT    = 3000;
const DOMAIN_MODULES = [
  {
    type: 'cdn',
    domain: 'cdn.m.waibao.com',
  },
  {
    type: 'proxy',
    proxy: 'localhost',
    proxyPort: DLIENT_PORT,
    entries: 'mobile',
    domain: ['m.waibao.com'],
  },
  {
    type: 'proxy',
    proxy: 'localhost',
    proxyPort: DLIENT_PORT,
    entries: 'admin',
    domain: ['admin.waibao.com'],
  },

];

function resolve(dir) {
  return dir ? path.join(__dirname, '..', dir) : path.join(__dirname, '../');
}

const LOG_DIR   = 'logs';
const DIST_DIR  = 'dist';
const ROOT_PATH = resolve();
const DIST_PATH = resolve(`${DIST_DIR}`);
const LOG_PATH  = resolve(`${LOG_DIR}`);

module.exports = {

  DOMAIN_MODULES,
  DLIENT_PORT,
  DIST_PATH,
  ROOT_PATH,
  LOG_PATH,

};
