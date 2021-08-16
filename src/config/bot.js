const ViberBot = require('viber-bot').Bot;
const urls = require('../constants/requestUrl');
const resMsg = require('../constants/responseMsg');

module.exports = () => {
  return new ViberBot({
    authToken: process.env.VIBER_ACCESS_TOKEN,
    name: resMsg.BOT_NAME,
    avatar: urls.BOT_AVATAR_URL,
  });
};
