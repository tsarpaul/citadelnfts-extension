var env = require('../utils/env');

// prod config
var api_url = 'https://api.citadelnfts.com';

// dev config
if (env.NODE_ENV == 'development') {
  api_url = 'http://localhost:80';
}

// exports
export const API_URL = api_url;

console.log("mode:", env.NODE_ENV);
