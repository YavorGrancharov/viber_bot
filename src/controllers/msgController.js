const fs = require('fs');
const path = require('path');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const BtcModel = require('../models/BtcModel');
const EthModel = require('../models/EthModel');

const cryptoController = require('./cryptoController');
const helper = require('../helpers/helper');
const urls = require('../constants/requestUrl');
const resMsg = require('../constants/responseMsg');
const reqMsg = require('../constants/requestMsg');
const method = require('../constants/requestMethod');
const headers = require('../constants/requestHeaders');

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
      reqMsg.BTC,
      reqMsg
    );
    const currentEthPrice = await cryptoController.currentPrice(
      reqMsg.ETH,
      reqMsg
    );

    const data = {
      chat_hostname: 'SN-CHAT-24_',
      broadcast_list: broadcastList,
      min_api_version: 7,
      type: 'text',
      text:
        `${resMsg.CURRENT_BTC_PRICE}$${currentBtcPrice}\n` +
        `${resMsg.CURRENT_ETH_PRICE}$${currentEthPrice}`,
    };

    headers['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
    helper.request(method.POST, urls.BROADCAST_MESSAGE_URL, {
      data: data,
      headers: headers,
    });
  },
  botResponseMsg: async (response, message) => {
    if (!(message instanceof TextMessage)) {
      _this.sendTextMsg(response, resMsg.TEXT_MESSAGE_ONLY);
    }

    if (message instanceof TextMessage) {
      let dbPrice = 0,
        diff = 0;
      switch (message.text) {
        case reqMsg.HI:
          _this.sendKeyboardMsg(response);
          break;
        case reqMsg.BTC:
          const btcPriceOnDemand = await cryptoController.currentPrice(
            reqMsg.BTC,
            reqMsg
          );
          dbPrice = await cryptoController.latestPriceFromDb(BtcModel);
          diff = helper.calcPriceDiff(btcPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(response, reqMsg.BTC, btcPriceOnDemand, diff);
          break;
        case reqMsg.ETH:
          const ethPriceOnDemand = await cryptoController.currentPrice(
            reqMsg.ETH,
            reqMsg
          );
          dbPrice = await cryptoController.latestPriceFromDb(EthModel);
          diff = helper.calcPriceDiff(ethPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(response, reqMsg.ETH, ethPriceOnDemand, diff);
          break;
        default:
          _this.sendTextMsg(response, resMsg.PLEASE_TYPE_HI);
          break;
      }
    }
  },
});
