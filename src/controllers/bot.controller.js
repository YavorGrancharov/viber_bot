const BotEvents = require('viber-bot').Events;

const localeService = require('../services/locale.service');

const { WELCOME_TO_FINANCE_BOT } =
  require('../constants/response.message').ResponseMessage;

const { saveUser, deleteUser } = require('./user.controller');
const {
  sendTextMsg,
  botResponseMsg,
  sendKeyboardMsg,
  sendWelcomeMsg,
} = require('./msg.controller');

module.exports = {
  onConversationStarted: (bot) => {
    bot.on(
      BotEvents.CONVERSATION_STARTED,
      (response, isSubscribed, context, onFinish) => {
        bot.sendMessage(
          response.userProfile,
          sendWelcomeMsg(response, WELCOME_TO_FINANCE_BOT)
        );
      }
    );
  },
  onMessageReceived: (bot) => {
    bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
      saveUser(response);
      botResponseMsg(response, message);
    });
  },
  onMessageSent: (bot) => {
    bot.on(BotEvents.MESSAGE_SENT, (message, response) => {
      console.log(`${response.userProfile.name} just sent message ${message}`);
    });
  },
  onSubscribe: (bot) => {
    bot.on(BotEvents.SUBSCRIBED, (response) => {
      saveUser(response);
      sendTextMsg(
        response,
        `${localeService.translate('Thanks_for_subscribing')} ${
          response.userProfile.name
        }`
      );
    });
  },
  onUnsubscribe: (bot) => {
    bot.on(BotEvents.UNSUBSCRIBED, (id) => {
      deleteUser(id);
    });
  },
  onError: (bot) => {
    bot.on(BotEvents.ERROR, (error) => {
      console.log(error);
    });
  },
  onTextMessage: (bot) => {
    bot.onTextMessage(/^(?!EN|BG|BTC$|ETH$).*$/i, (message, response) => {
      bot.sendMessage(response.userProfile, sendKeyboardMsg(response));
    });
  },
};
