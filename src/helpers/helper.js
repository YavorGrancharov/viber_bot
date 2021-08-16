const unirest = require('unirest');
const { RequestUrl } = require('../constants/requestUrl');
const { RequestMethod } = require('../constants/requestMethod');

module.exports = {
  getTicker: async (pairKey) => {
    const req = await unirest(
      RequestMethod.GET,
      `${RequestUrl.KRAKEN_URL}${pairKey}`
    );

    return req.body.result;
  },
  calcPriceDiff: (currentPrice, oldPriceFromDb) => {
    let diff = (((currentPrice - oldPriceFromDb) / currentPrice) * 100).toFixed(
      2
    );

    return Number(diff);
  },
  setProp: (diff) => {
    let direction = '';
    let color = '';
    if (diff < 0) {
      color = '#FF0000';
      direction = 'down';
    } else {
      color = '#35D073';
      direction = 'up';
    }

    return {
      color,
      direction,
    };
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
