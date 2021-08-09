const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const ethController = require('./src/controllers/consolidator').ethereum;
const btcController = require('./src/controllers/consolidator').bitcoin;

module.exports = () => {
  // Save latest ETH, BTC prices to DB on every 24h
  btcController.savePrice();
  ethController.savePrice();

  // Send daily price to subscribers
  msgController.sendSubscribersDailyMsg(userController);
};
