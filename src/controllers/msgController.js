const fs = require('fs');
const path = require('path');
const unirest = require('unirest');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const ethController = require('./ethController');
const btcController = require('./btcController');

const helper = require('../helpers/helper');

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

    const currentBtcPrice = await btcController.currentPrice();
    const currentEthPrice = await ethController.currentPrice();

    const data = {
      auth_token: process.env.VIBER_ACCESS_TOKEN,
      chat_hostname: 'SN-CHAT-24_',
      broadcast_list: broadcastList,
      min_api_version: 7,
      type: 'text',
      text:
        `Current BTC price: $${currentBtcPrice}\n` +
        `Current ETH price: $${currentEthPrice}`,
    };

    unirest
      .post('https://chatapi.viber.com/pa/broadcast_message')
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .send(data)
      .then((response) => {
        console.log(response.body);
      });
  },
  botResponseMsg: async (response, message) => {
    if (!(message instanceof TextMessage)) {
      _this.sendTextMsg(
        response,
        `Sorry. I can only understand text messages.`
      );
    }

    if (message instanceof TextMessage) {
      let dbPrice = 0,
        diff = 0;
      switch (message.text) {
        case 'Hi':
          _this.sendKeyboardMsg(response);
          break;
        case 'BTC':
          const btcPriceOnDemand = await btcController.currentPrice();
          dbPrice = await btcController.latestPriceFromDb();
          diff = helper.calcPriceDiff(btcPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(response, 'BTC', btcPriceOnDemand, diff);
          break;
        case 'ETH':
          const ethPriceOnDemand = await ethController.currentPrice();
          dbPrice = await ethController.latestPriceFromDb();
          diff = helper.calcPriceDiff(ethPriceOnDemand, dbPrice);
          _this.sendRichMediaMsg(response, 'ETH', ethPriceOnDemand, diff);
          break;
        default:
          _this.sendTextMsg(
            response,
            `Please type \'Hi\' to see BTC and ETH buttons.`
          );
          break;
      }
    }
  },
});
