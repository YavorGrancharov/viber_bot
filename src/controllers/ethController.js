const ethApi = require('../api/ethApi');

module.exports = {
  savePrice: () => {
    return ethApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return ethApi.getLatestPriceFromDb();
  },
  currentPrice: () => {
    return ethApi.getCurrentPrice();
  },
};
