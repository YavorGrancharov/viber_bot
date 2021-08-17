const cryptoApi = require('./src/api/cryptoApi');
const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const { RequestMessage } = require('./src/constants/requestMessage');

const BtcModel = require('./src/models/BtcModel');
const EthModel = require('./src/models/EthModel');

const cron = require('node-cron');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    // Save latest ETH, BTC prices to DB on every 24h
    cryptoApi.savePriceToDb(BtcModel, RequestMessage.BTC, RequestMessage);
    cryptoApi.savePriceToDb(EthModel, RequestMessage.ETH, RequestMessage);

    // Send daily price to subscribers
    msgController.sendSubscribersDailyMsg(userController);
  });
};
