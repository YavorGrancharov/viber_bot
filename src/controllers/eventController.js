const { EventEmitter } = require('events');
const ev = new EventEmitter();

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const { getCurrentPrice, getPriceFromDb } = require('../api/cryptoApi');
const { calcPriceChange } = require('../helpers/helper');

const localeService = require('../services/localeService');

const { BTC, ETH, EN, BG } =
  require('../constants/requestMessage').RequestMessage;

ev.on('EN', (response, listener) => {
  localeService.setLocale(EN);
  listener.sendKeyboardMsg(response);
});

ev.on('BG', (response, listener) => {
  localeService.setLocale(BG);
  listener.sendKeyboardMsg(response);
});

ev.on('BTC', async (response, listener) => {
  _bindCryptoData(response, BTC, BtcModel, listener);
});

ev.on('ETH', async (response, listener) => {
  _bindCryptoData(response, ETH, EthModel, listener);
});

async function _bindCryptoData(response, crypto, model, listener) {
  let dbPrice = 0,
    change = 0;
  const cryptoCurrentPrice = await getCurrentPrice(crypto);
  dbPrice = await getPriceFromDb(model);
  change = calcPriceChange(cryptoCurrentPrice, dbPrice);
  listener.sendRichMediaMsg(response, crypto, cryptoCurrentPrice, change);
}

module.exports = { ev };
