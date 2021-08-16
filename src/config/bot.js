const ViberBot = require('viber-bot').Bot;
const { RequestUrl } = require('../constants/requestUrl');
const { ResponseMessage } = require('../constants/responseMessage');

module.exports = () => {
  return new ViberBot({
    authToken: process.env.VIBER_ACCESS_TOKEN,
    name: ResponseMessage.BOT_NAME,
    avatar: RequestUrl.BOT_AVATAR_URL,
  });
};
