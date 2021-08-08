const ethApi = require('../api/ethApi');

module.exports = {
  savePrice: () => {
    return ethApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return ethApi.getPriceFromDb();
  },
  currentPrice: () => {
    return ethApi.getCurrentPrice();
  },
};
