const fs = require('fs');
const path = require('path');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const { getCurrentPrice, getPriceFromDb } = require('../api/cryptoApi');
const { request, setProp, calcPriceDiff } = require('../helpers/helper');

const { RequestMessage } = require('../constants/requestMessage');
const { RequestHeaders } = require('../constants/requestHeaders');

const { POST } = require('../constants/requestMethod').RequestMethod;
const { BROADCAST_MESSAGE_URL } = require('../constants/requestUrl').RequestUrl;
const {
  CURRENT_BTC_PRICE,
  CURRENT_ETH_PRICE,
  TEXT_MESSAGE_ONLY,
  PLEASE_TYPE_HI,
} = require('../constants/responseMessage').ResponseMessage;

const _this = (module.exports = {
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
  sendSubscribersDailyMsg: async (userController) => {
    let broadcastList = [];
    const users = await userController.getAllUsers();
    users.forEach((user) => {
      broadcastList.push(user.viberId);
    });

    const currentBtcPrice = await getCurrentPrice(
      RequestMessage.BTC,
      RequestMessage
    );
    const currentEthPrice = await getCurrentPrice(
      RequestMessage.ETH,
      RequestMessage
    );

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
      _this.sendTextMsg(response, TEXT_MESSAGE_ONLY);
    }

    if (message instanceof TextMessage) {
      let dbPrice = 0,
        diff = 0;
      switch (message.text) {
        case RequestMessage.HI:
          _this.sendKeyboardMsg(response);
          break;
        case RequestMessage.BTC:
          const btcPriceOnDemand = await getCurrentPrice(
            RequestMessage.BTC,
            RequestMessage
          );
          dbPrice = await getPriceFromDb(BtcModel);
          diff = calcPriceDiff(btcPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(
            response,
            RequestMessage.BTC,
            btcPriceOnDemand,
            diff
          );
          break;
        case RequestMessage.ETH:
          const ethPriceOnDemand = await getCurrentPrice(
            RequestMessage.ETH,
            RequestMessage
          );
          dbPrice = await getPriceFromDb(EthModel);
          diff = calcPriceDiff(ethPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(
            response,
            RequestMessage.ETH,
            ethPriceOnDemand,
            diff
          );
          break;
        default:
          _this.sendTextMsg(response, PLEASE_TYPE_HI);
          break;
      }
    }
  },
});
