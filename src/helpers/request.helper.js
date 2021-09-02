const unirest = require('unirest');

const { KRAKEN_URL } = require('../constants/request.url').RequestUrl;
const { GET } = require('../constants/request.method').RequestMethod;

module.exports = {
  getTicker: async (pairKey) => {
    const req = await unirest(GET, `${KRAKEN_URL}${pairKey}`);

    return req.body.result;
  },
  request: (method, url, { data = {}, headers }) => {
    return unirest(method, url)
      .headers(headers)
      .send(data)
      .then((response) => {
        console.log(response.body);
        return response.body;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
