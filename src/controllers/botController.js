const BotEvents = require('viber-bot').Events;

const userController = require('./userController');
const msgController = require('./msgController');

module.exports = {
  onMessageReceived: (bot) => {
    bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
      userController.saveUser(response);
      msgController.botResponseMsg(response, message);
    });
  },
  onSubscribed: (bot) => {
    bot.on(BotEvents.onSubscribed, (response) => {
      response.send(`Thanks for subscribing, ${response.userProfile.name}`);
    });
  },
  onError: (bot) => {
    bot.on(BotEvents.onError, (error) => {
      console.log(error);
    });
  },
};
