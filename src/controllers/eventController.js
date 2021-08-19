const { EventEmitter } = require('events');
const ev = new EventEmitter();

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const { getCurrentPrice, getPriceFromDb } = require('../api/cryptoApi');
const { calcPriceDiff } = require('../helpers/helper');

const { HI, BTC, ETH } = require('../constants/requestMessage').RequestMessage;

ev.on(HI, (response, callback) => {
  callback.sendKeyboardMsg(response);
});

ev.on(BTC, async (response, callback) => {
  let dbPrice = 0,
    diff = 0;
  const btcPriceOnDemand = await getCurrentPrice(BTC);
  dbPrice = await getPriceFromDb(BtcModel);
  diff = calcPriceDiff(btcPriceOnDemand, dbPrice);
  callback.sendRichMediaMsg(response, BTC, btcPriceOnDemand, diff);
});

ev.on(ETH, async (response, callback) => {
  let dbPrice = 0,
    diff = 0;
  const ethPriceOnDemand = await getCurrentPrice(ETH);
  dbPrice = await getPriceFromDb(EthModel);
  diff = calcPriceDiff(ethPriceOnDemand, dbPrice);
  callback.sendRichMediaMsg(response, ETH, ethPriceOnDemand, diff);
});

module.exports = { ev };
