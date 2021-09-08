const { EventEmitter } = require('events');
const ev = new EventEmitter();

const BtcModel = require('../models/bitcoin.model');
const EthModel = require('../models/ethereum.model');

const { getCurrentPrice, getPriceFromDb } = require('../api/crypto.api');
const { calcPriceChange } = require('../helpers/common.ops.helper');

const localeService = require('../services/locale.service');

const { BTC, ETH, EN, BG } =
  require('../constants/request.message').RequestMessage;

ev.on(EN, (response, listener) => {
  localeService.setLocale(EN);
  listener.sendTextMsg(response, localeService.translate('Language_changed'));
});

ev.on(BG, (response, listener) => {
  localeService.setLocale(BG);
  listener.sendTextMsg(response, localeService.translate('Language_changed'));
});

ev.on(BTC, (response, listener) => {
  _bindCryptoData(response, BTC, BtcModel, listener);
});

ev.on(ETH, (response, listener) => {
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
