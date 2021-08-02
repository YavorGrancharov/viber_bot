const ethApi = require('../api/ethApi');

module.exports = {
  savePrice: async () => {
    return await ethApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return ethApi.getPriceFromDb();
  },
  currentPrice: () => {
    return ethApi.getCurrentPrice();
  },
};
