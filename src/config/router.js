const bot = require('../config/bot')();
const { ResponseMessage } = require('../constants/responseMessage');

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.send(`${ResponseMessage.HELLO}${bot.name}.`);
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(ResponseMessage.ANSWER_TO_EVERYTHING);
    });
  },
};
