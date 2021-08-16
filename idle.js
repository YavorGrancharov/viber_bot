const helper = require('./src/helpers/helper');
const { RequestMethod } = require('./src/constants/requestMethod');
const { RequestHeaders } = require('./src/constants/requestHeaders');

module.exports = (url) => {
  setInterval(() => {
    helper.request(RequestMethod.POST, url, {
      headers: RequestHeaders,
    });
  }, 20 * 60 * 1000);
};
