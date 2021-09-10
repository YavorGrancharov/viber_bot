const unirest = require('unirest');

const { KRAKEN_URL } = require('../constants/request.url').RequestUrl;
const { GET } = require('../constants/request.method').RequestMethod;

module.exports = {
  getTicker: (pairKey) => {
    return new Promise(async (resolve, reject) => {
      const req = await unirest(GET, `${KRAKEN_URL}${pairKey}`);

      resolve(req.body.result);
    }).catch((err) => {
      console.log(err);
    });
  },
  request: (method, url, { data = {}, headers }) => {
    return new Promise((resolve, reject) => {
      return unirest(method, url)
        .headers(headers)
        .send(data)
        .then((response) => {
          console.log(response.body);
          resolve(response.body);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};
