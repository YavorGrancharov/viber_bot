const BotEvents = require('viber-bot').Events;
const Events = require('../constants/botEvents');
const resMsg = require('../constants/responseMsg');

const userController = require('./userController');
const msgController = require('./msgController');

module.exports = {
  onMessageReceived: (bot) => {
    bot.on(BotEvents[Events.MESSAGE_RECEIVED], async (message, response) => {
      userController.saveUser(response);
      msgController.botResponseMsg(response, message);
    });
  },
  onSubscribed: (bot) => {
    bot.on(BotEvents[Events.SUBSCRIBED], (response) => {
      response.send(
        `${resMsg.THANKS_FOR_SUBSCRIBING}, ${response.userProfile.name}`
      );
    });
  },
  onError: (bot) => {
    bot.on(BotEvents[Events.ERROR], (error) => {
      console.log(error);
    });
  },
};
