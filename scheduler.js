const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const ethController = require('./src/controllers/consolidator').ethereum;
const btcController = require('./src/controllers/consolidator').bitcoin;
const cron = require('node-cron');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    // Save latest ETH, BTC prices to DB on every 24h
    btcController.savePrice();
    ethController.savePrice();

    // Send daily price to subscribers
    msgController.sendSubscribersDailyMsg(userController);
  });
};
