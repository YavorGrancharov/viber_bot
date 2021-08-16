const cryptoApi = require('../api/cryptoApi');

module.exports = {
  savePrice: (model, crypto, requestMessage) => {
    return cryptoApi.savePriceToDb(model, crypto, requestMessage);
  },
  latestPriceFromDb: (model) => {
    return cryptoApi.getPriceFromDb(model);
  },
  currentPrice: (crypto, requestMessage) => {
    return cryptoApi.getCurrentPrice(crypto, requestMessage);
  },
};
