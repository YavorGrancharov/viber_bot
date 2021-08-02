const btcApi = require('../api/btcApi');

module.exports = {
  savePrice: async () => {
    return await btcApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return btcApi.getPriceFromDb();
  },
  currentPrice: () => {
    return btcApi.getCurrentPrice();
  },
};
