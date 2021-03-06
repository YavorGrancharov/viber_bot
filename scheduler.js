const { BTC, ETH } = require('./src/constants/request.message').RequestMessage;
const { savePriceToDb } = require('./src/api/crypto.api');
const { sendSubscribersDailyMsg } =
  require('./src/controllers/consolidator').message;

const BtcModel = require('./src/models/bitcoin.model');
const EthModel = require('./src/models/ethereum.model');

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
