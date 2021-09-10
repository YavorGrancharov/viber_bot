const fs = require('fs');
const path = require('path');

const localeService = require('../services/locale.service');

const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

const { ev } = require('./event.controller');
const { RequestHeaders } = require('../constants/request.headers');

const { getAllUsersFromDb } = require('../api/users.api');
const { getCurrentPrice } = require('../api/crypto.api');
const { request } = require('../helpers/request.helper');
const { setProp } = require('../helpers/common.ops.helper');

const { POST } = require('../constants/request.method').RequestMethod;
const { BTC, ETH } = require('../constants/request.message').RequestMessage;
const { BROADCAST_MESSAGE_URL } =
  require('../constants/request.url').RequestUrl;

const STATIC_KEYBOARD = require('../msgJsonTemplates/keyboard.message.json');

const postman = (module.exports = {
  // NOT USED ANYMORE

  // sendWelcomeMsg: (response, message) => {
  //   let msg = '';
  //   const filePath = path.normalize(
  //     path.join(__dirname, '../msgJsonTemplates/welcome.message.json')
  //   );

  //   const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

  //   stream.on('data', (piece) => {
  //     msg += piece;
  //   });

  //   stream.on('end', () => {
  //     msg = JSON.parse(msg);
  //     msg.receiver = response.userProfile.id;
  //     msg.text = message;
  //     const welcomeMsg = msg;
  //     RequestHeaders['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
  //     request(POST, SEND_MESSAGE_URL, {
  //       data: welcomeMsg,
  //       headers: RequestHeaders,
  //     });
  //   });

  //   stream.on('error', (error) => {
  //     console.log(error.stack);
  //   });
  // },
  sendTextMsg: (response, message) => {
    return new Promise((resolve, reject) => {
      postman
        .sendKeyboard()
        .then((keyboard) => {
          resolve(response.send(new TextMessage(message, keyboard)));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendKeyboard: () => {
    return new Promise((resolve, reject) => {
      let msg = '';
      const filePath = path.normalize(
        path.join(__dirname, '../msgJsonTemplates/keyboard.message.json')
      );

      const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

      stream.on('open', () => {
        console.log(localeService.translate('Postman_knocks_twice'));
      });

      stream.on('data', (piece) => {
        msg += piece;
      });

      stream.on('end', () => {
        msg = JSON.parse(msg);
      });

      stream.on('close', () => {
        resolve(msg);
      });

      stream.on('error', (error) => {
        console.log(error.stack);
        reject(error);
      });
    });
  },
  sendRichMediaMsg: (response, crypto, price, diff) => {
    return new Promise((resolve, reject) => {
      postman
        .sendKeyboard()
        .then((keyboard) => {
          let msg = '';
          const filePath = path.normalize(
            path.join(__dirname, '../msgJsonTemplates/rich-media.message.json')
          );

          const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

          stream.on('data', (piece) => {
            msg += piece;
          });

          stream.on('end', async () => {
            const color = setProp(diff).color;
            const direction = localeService.translate(setProp(diff).direction);
            msg = JSON.parse(msg);
            msg.Buttons[0].Text =
              `<font color=\"#FFFFFF\">${localeService.translate(
                'Current_price_is',
                {
                  name: crypto,
                  value: price,
                }
              )}</font>` +
              `<br><br><font color=\"#FFFFFF\">${localeService.translate(
                'Last_24_hours_change',
                { value: direction }
              )}</font>` +
              `<span style=\"color:${color}\">${diff}%</span><br>`;

            const richMediaMsg = msg;
            resolve(
              response.send(
                new RichMediaMessage(richMediaMsg, keyboard, null, null)
              )
            );
          });

          stream.on('close', () => {
            console.log(localeService.translate('You_have_been_served'));
          });

          stream.on('error', (error) => {
            console.log(error.stack);
            reject(error);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendSubscribersDailyMsg: async () => {
    let broadcastList = [];
    const users = await getAllUsersFromDb();
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
        `${localeService.translate('Current_BTC_price')}$${currentBtcPrice}\n` +
        `${localeService.translate('Current_ETH_price')}$${currentEthPrice}`,
    };

    RequestHeaders['X-Viber-Auth-Token'] = process.env.VIBER_ACCESS_TOKEN;
    request(POST, BROADCAST_MESSAGE_URL, {
      data: data,
      headers: RequestHeaders,
    });
  },
  botResponseMsg: (response, message) => {
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
