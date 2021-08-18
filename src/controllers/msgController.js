const fs = require('fs');
const path = require('path');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const { RequestHeaders } = require('../constants/requestHeaders');

const { getAllUsers } = require('./userController');
const { getCurrentPrice, getPriceFromDb } = require('../api/cryptoApi');
const { request, setProp, calcPriceDiff } = require('../helpers/helper');

const { POST } = require('../constants/requestMethod').RequestMethod;
const { HI, BTC, ETH } = require('../constants/requestMessage').RequestMessage;
const { BROADCAST_MESSAGE_URL } = require('../constants/requestUrl').RequestUrl;
const {
  CURRENT_BTC_PRICE,
  CURRENT_ETH_PRICE,
  TEXT_MESSAGE_ONLY,
  PLEASE_TYPE_HI,
} = require('../constants/responseMessage').ResponseMessage;

const postman = (module.exports = {
  sendTextMsg: (response, message) => {
    response.send(new TextMessage(message));
  },
  sendKeyboardMsg: (response) => {
    const filePath = path.normalize(
      path.join(__dirname, '../msgJsonTemplates/keyboardMsg.json')
    );
    fs.readFile(filePath, 'utf8', (err, msg) => {
      if (err) {
        console.log(err);
        return;
      }

      const keyboardMsg = JSON.parse(msg);
      try {
        response.send(new KeyboardMessage(keyboardMsg, null, null, null, 3));
      } catch (error) {
        console.log(error);
      }
    });
  },
  sendRichMediaMsg: async (response, crypto, price, diff) => {
    const filePath = path.normalize(
      path.join(__dirname, '../msgJsonTemplates/richMediaMsg.json')
    );
    fs.readFile(filePath, 'utf8', (err, msg) => {
      if (err) {
        console.log(err);
        return;
      }

      const color = setProp(diff).color;
      const direction = setProp(diff).direction;

      msg = JSON.parse(msg);
      msg.Buttons[0].Text =
        `<font color=\"#FFFFFF\">Current ${crypto} price is $${price}</font>` +
        `<br><br><font color=\"#FFFFFF\">It is ${direction} for the last 24h with </font>` +
        `<span style=\"color:${color}\">${diff}%</span><br>`;

      const richMediaMsg = msg;
      try {
        response.send(new RichMediaMessage(richMediaMsg, null, null));
      } catch (error) {
        console.log(error);
      }
    });
  },
  sendSubscribersDailyMsg: async () => {
    let broadcastList = [];
    const users = await getAllUsers();
    users.forEach((user) => {
      broadcastList.push(user.viberId);
    });

    const currentBtcPrice = await getCurrentPrice(BTC);
    const currentEthPrice = await getCurrentPrice(ETH);

    const data = {
      chat_hostname: 'SN-CHAT-24_',
      broadcast_list: broadcastList,
      min_api_version: 7,
      type: 'text',
      text:
        `${CURRENT_BTC_PRICE}$${currentBtcPrice}\n` +
        `${CURRENT_ETH_PRICE}$${currentEthPrice}`,
    };

    RequestHeaders['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
    request(POST, BROADCAST_MESSAGE_URL, {
      data: data,
      headers: RequestHeaders,
    });
  },
  botResponseMsg: async (response, message) => {
    if (!(message instanceof TextMessage)) {
      postman.sendTextMsg(response, TEXT_MESSAGE_ONLY);
    }

    if (message instanceof TextMessage) {
      let dbPrice = 0,
        diff = 0;
      switch (message.text) {
        case HI:
          postman.sendKeyboardMsg(response);
          break;
        case BTC:
          const btcPriceOnDemand = await getCurrentPrice(BTC);
          dbPrice = await getPriceFromDb(BtcModel);
          diff = calcPriceDiff(btcPriceOnDemand, dbPrice);
          postman.sendRichMediaMsg(response, BTC, btcPriceOnDemand, diff);
          break;
        case ETH:
          const ethPriceOnDemand = await getCurrentPrice(ETH);
          dbPrice = await getPriceFromDb(EthModel);
          diff = calcPriceDiff(ethPriceOnDemand, dbPrice);
          postman.sendRichMediaMsg(response, ETH, ethPriceOnDemand, diff);
          break;
        default:
          postman.sendTextMsg(response, PLEASE_TYPE_HI);
          break;
      }
    }
  },
});
