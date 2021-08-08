const unirest = require('unirest');

module.exports = {
  getTicker: async (pairKey) => {
    const req = await unirest(
      'GET',
      `https://api.kraken.com/0/public/Ticker?pair=${pairKey}`
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
};
