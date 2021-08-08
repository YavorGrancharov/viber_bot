const BotEvents = require('viber-bot').Events;

const userController = require('./userController');
const msgController = require('./msgController');

module.exports = (bot) => {
  bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    userController.saveUser(response);
    msgController.botResponseMsg(response, message);
  });
};
