const helper = require('./src/helpers/helper');
const method = require('./src/constants/requestMethod');
const headers = require('./src/constants/requestHeaders');

module.exports = (url) => {
  setInterval(() => {
    helper.request(method.POST, url, {
      headers: headers,
    });
  }, 20 * 60 * 1000);
};
