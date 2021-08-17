const { request } = require('./src/helpers/helper');
const { RequestHeaders } = require('./src/constants/requestHeaders');
const { POST } = require('./src/constants/requestMethod').RequestMethod;

module.exports = (url) => {
  setInterval(() => {
    request(POST, url, {
      headers: RequestHeaders,
    });
  }, 20 * 60 * 1000);
};
