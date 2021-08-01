const btcApi = require('../api/btcApi');

module.exports = {
  savePrice: async () => {
    return await btcApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return btcApi.getLatestPriceFromDb();
  },
  currentPrice: () => {
    return btcApi.getCurrentPrice();
  },
};
