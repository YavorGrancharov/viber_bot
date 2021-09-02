const { request } = require('./src/helpers/request.helper');
const { RequestHeaders } = require('./src/constants/request.headers');
const { POST } = require('./src/constants/request.method').RequestMethod;

module.exports = (url) => {
  setInterval(() => {
    request(POST, url, {
      headers: RequestHeaders,
    });
  }, 20 * 60 * 1000);
};
