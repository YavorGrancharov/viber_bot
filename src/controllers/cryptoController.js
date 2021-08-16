const cryptoApi = require('../api/cryptoApi');

module.exports = {
  savePrice: (model, crypto, reqMsg) => {
    return cryptoApi.savePriceToDb(model, crypto, reqMsg);
  },
  latestPriceFromDb: (model) => {
    return cryptoApi.getPriceFromDb(model);
  },
  currentPrice: (crypto, reqMsg) => {
    return cryptoApi.getCurrentPrice(crypto, reqMsg);
  },
};
