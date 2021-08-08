const btcApi = require('../api/btcApi');

module.exports = {
  savePrice: () => {
    return btcApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return btcApi.getPriceFromDb();
  },
  currentPrice: () => {
    return btcApi.getCurrentPrice();
  },
};
