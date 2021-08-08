const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;

const userController = require('./userController');
const msgController = require('./msgController');

module.exports = (bot) => {
  bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    if (!(message instanceof TextMessage)) {
      msgController.sendTextMsg(
        response,
        `Sorry. I can only understand text messages.`
      );
    }

    if (message instanceof TextMessage) {
      userController.saveUser(response);
      msgController.botResponseMsg(response, message);
      msgController.sendTextMsg(response);
    }
  });
};
