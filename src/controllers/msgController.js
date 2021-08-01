const fs = require('fs');
const path = require('path');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const helper = require('../helpers/helper');

module.exports = {
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
      path.join(__dirname, '../msgJsonTemplates//richMediaMsg.json')
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
};
