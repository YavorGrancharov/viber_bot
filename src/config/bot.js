const ViberBot = require('viber-bot').Bot;
const { BOT_AVATAR_URL } = require('../constants/requestUrl').RequestUrl;
const { BOT_NAME } = require('../constants/responseMessage').ResponseMessage;

module.exports = () => {
  return new ViberBot({
    authToken: process.env.VIBER_ACCESS_TOKEN,
    name: BOT_NAME,
    avatar: BOT_AVATAR_URL,
  });
};
