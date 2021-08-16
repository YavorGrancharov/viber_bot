const fs = require('fs');
const path = require('path');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const cryptoController = require('./cryptoController');
const helper = require('../helpers/helper');

const { RequestUrl } = require('../constants/requestUrl');
const { ResponseMessage } = require('../constants/responseMessage');
const { RequestMessage } = require('../constants/requestMessage');
const { RequestMethod } = require('../constants/requestMethod');
const { RequestHeaders } = require('../constants/requestHeaders');

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

      const color = helper.setProp(diff).color;
      const direction = helper.setProp(diff).direction;

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

    const currentBtcPrice = await cryptoController.currentPrice(
      RequestMessage.BTC,
      RequestMessage
    );
    const currentEthPrice = await cryptoController.currentPrice(
      RequestMessage.ETH,
      RequestMessage
    );

    const data = {
      chat_hostname: 'SN-CHAT-24_',
      broadcast_list: broadcastList,
      min_api_version: 7,
      type: 'text',
      text:
        `${ResponseMessage.CURRENT_BTC_PRICE}$${currentBtcPrice}\n` +
        `${ResponseMessage.CURRENT_ETH_PRICE}$${currentEthPrice}`,
    };

    RequestHeaders['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
    helper.request(RequestMethod.POST, RequestUrl.BROADCAST_MESSAGE_URL, {
      data: data,
      headers: RequestHeaders,
    });
  },
  botResponseMsg: async (response, message) => {
    if (!(message instanceof TextMessage)) {
      _this.sendTextMsg(response, ResponseMessage.TEXT_MESSAGE_ONLY);
    }

    if (message instanceof TextMessage) {
      let dbPrice = 0,
        diff = 0;
      switch (message.text) {
        case RequestMessage.HI:
          _this.sendKeyboardMsg(response);
          break;
        case RequestMessage.BTC:
          const btcPriceOnDemand = await cryptoController.currentPrice(
            RequestMessage.BTC,
            RequestMessage
          );
          dbPrice = await cryptoController.latestPriceFromDb(BtcModel);
          diff = helper.calcPriceDiff(btcPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(
            response,
            RequestMessage.BTC,
            btcPriceOnDemand,
            diff
          );
          break;
        case RequestMessage.ETH:
          const ethPriceOnDemand = await cryptoController.currentPrice(
            RequestMessage.ETH,
            RequestMessage
          );
          dbPrice = await cryptoController.latestPriceFromDb(EthModel);
          diff = helper.calcPriceDiff(ethPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(
            response,
            RequestMessage.ETH,
            ethPriceOnDemand,
            diff
          );
          break;
        default:
          _this.sendTextMsg(response, ResponseMessage.PLEASE_TYPE_HI);
          break;
      }
    }
  },
});
