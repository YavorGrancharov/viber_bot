const btcApi = require('../api/btcApi');

module.exports = {
  savePrice: () => {
    return btcApi.saveBtcPriceToDb();
  },
  latestPriceFromDb: () => {
    return btcApi.getLatestPriceFromDb();
  },
  currentPrice: () => {
    return btcApi.getCurrentPrice();
  },
};
