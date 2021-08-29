const fs = require('fs');
const path = require('path');

const localeService = require('../services/locale.service');

const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const { ev } = require('./event.controller');
const { RequestHeaders } = require('../constants/request.headers');

const { getAllUsers } = require('./user.controller');
const { getCurrentPrice } = require('../api/crypto.api');
const { request, setProp } = require('../helpers/helper');

const { POST } = require('../constants/request.method').RequestMethod;
const { BTC, ETH } = require('../constants/request.message').RequestMessage;
const { BROADCAST_MESSAGE_URL, SEND_MESSAGE_URL } =
  require('../constants/request.url').RequestUrl;
const {
  CURRENT_BTC_PRICE,
  CURRENT_ETH_PRICE,
  POSTMAN_KNOCKS_TWICE,
  YOU_HAVE_BEEN_SERVED,
} = require('../constants/response.message').ResponseMessage;

const postman = (module.exports = {
  sendWelcomeMsg: (response, message) => {
    let msg = '';
    const filePath = path.normalize(
      path.join(__dirname, '../msgJsonTemplates/welcome.message.json')
    );

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

    stream.on('data', (piece) => {
      msg += piece;
    });

    stream.on('end', () => {
      msg = JSON.parse(msg);
      msg.receiver = response.userProfile.id;
      msg.text = message;
      const welcomeMsg = msg;
      RequestHeaders['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
      request(POST, SEND_MESSAGE_URL, {
        data: welcomeMsg,
        headers: RequestHeaders,
      });
    });

    stream.on('error', (error) => {
      console.log(error.stack);
    });
  },
  sendTextMsg: (response, message) => {
    response.send(new TextMessage(message));
  },
  sendKeyboardMsg: (response) => {
    let msg = '';
    const filePath = path.normalize(
      path.join(__dirname, '../msgJsonTemplates/keyboard.message.json')
    );

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

    stream.on('open', () => {
      console.log(POSTMAN_KNOCKS_TWICE);
    });

    stream.on('data', (piece) => {
      msg += piece;
    });

    stream.on('end', () => {
      const keyboardMsg = JSON.parse(msg);
      response.send(new KeyboardMessage(keyboardMsg, null, null, null, 3));
    });

    stream.on('error', (error) => {
      console.log(error.stack);
    });
  },
  sendRichMediaMsg: async (response, crypto, price, diff) => {
    let msg = '';
    const filePath = path.normalize(
      path.join(__dirname, '../msgJsonTemplates/rich-media.message.json')
    );

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

    stream.on('data', (piece) => {
      msg += piece;
    });

    stream.on('end', () => {
      const color = setProp(diff).color;
      const direction = localeService.translate(setProp(diff).direction);
      msg = JSON.parse(msg);
      msg.Buttons[0].Text =
        `<font color=\"#FFFFFF\">${localeService.translate('Current_price_is', {
          name: crypto,
          value: price,
        })}</font>` +
        `<br><br><font color=\"#FFFFFF\">${localeService.translate(
          'Last_24_hours_change',
          { value: direction }
        )}</font>` +
        `<span style=\"color:${color}\">${diff}%</span><br>`;

      const richMediaMsg = msg;
      response.send(new RichMediaMessage(richMediaMsg, null, null));
    });

    stream.on('close', () => {
      console.log(YOU_HAVE_BEEN_SERVED);
    });

    stream.on('error', (error) => {
      console.log(error.stack);
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
      postman.sendTextMsg(
        response,
        localeService.translate('I_can_only_understand_text_messages')
      );
    }

    if (message instanceof TextMessage) {
      const compare = new RegExp(/^EN|BG|BTC|ETH$/i);
      if (compare.test(message.text)) {
        ev.emit(message.text, response, postman);
      }
    }
  },
});
