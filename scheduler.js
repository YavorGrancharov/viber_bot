const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const cryptoController = require('./src/controllers/consolidator').crypto;
const reqMsg = require('./src/constants/requestMsg');

const BtcModel = require('./src/models/BtcModel');
const EthModel = require('./src/models/EthModel');

const cron = require('node-cron');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    // Save latest ETH, BTC prices to DB on every 24h
    cryptoController.savePrice(BtcModel, reqMsg.BTC, reqMsg);
    cryptoController.savePrice(EthModel, reqMsg.ETH, reqMsg);

    // Send daily price to subscribers
    msgController.sendSubscribersDailyMsg(userController);
  });
};
