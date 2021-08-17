const { RequestMessage } = require('./src/constants/requestMessage');
const { user } = require('./src/controllers/consolidator');

const { savePriceToDb } = require('./src/api/cryptoApi');
const { sendSubscribersDailyMsg } =
  require('./src/controllers/consolidator').message;

const BtcModel = require('./src/models/BtcModel');
const EthModel = require('./src/models/EthModel');

const cron = require('node-cron');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    // Save latest ETH, BTC prices to DB on every 24h
    savePriceToDb(BtcModel, RequestMessage.BTC, RequestMessage);
    savePriceToDb(EthModel, RequestMessage.ETH, RequestMessage);

    // Send daily price to subscribers
    sendSubscribersDailyMsg(user);
  });
};
