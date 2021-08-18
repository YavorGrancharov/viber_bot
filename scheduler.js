const { BTC, ETH } = require('./src/constants/requestMessage').RequestMessage;
const { savePriceToDb } = require('./src/api/cryptoApi');
const { sendSubscribersDailyMsg } =
  require('./src/controllers/consolidator').message;

const BtcModel = require('./src/models/BtcModel');
const EthModel = require('./src/models/EthModel');

const cron = require('node-cron');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    // Save latest ETH, BTC prices to DB on every 24h
    savePriceToDb(BtcModel, BTC);
    savePriceToDb(EthModel, ETH);

    // Send daily price to subscribers
    sendSubscribersDailyMsg();
  });
};
