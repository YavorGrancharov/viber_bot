const BotEvents = require('viber-bot').Events;
const { THANKS_FOR_SUBSCRIBING } =
  require('../constants/responseMessage').ResponseMessage;

const { saveUser } = require('./userController');
const { botResponseMsg } = require('./msgController');

module.exports = {
  onMessageReceived: (bot) => {
    bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
      saveUser(response);
      botResponseMsg(response, message);
    });
  },
  onSubscribed: (bot) => {
    bot.on(BotEvents.SUBSCRIBED, (response) => {
      response.send(`${THANKS_FOR_SUBSCRIBING}, ${response.userProfile.name}`);
    });
  },
  onError: (bot) => {
    bot.on(BotEvents.ERROR, (error) => {
      console.log(error);
    });
  },
};
