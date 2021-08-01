const ethApi = require('../api/ethApi');

module.exports = {
  savePrice: async () => {
    return await ethApi.savePriceToDb();
  },
  latestPriceFromDb: () => {
    return ethApi.getLatestPriceFromDb();
  },
  currentPrice: () => {
    return ethApi.getCurrentPrice();
  },
};
