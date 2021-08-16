const bot = require('../config/bot')();
const resMsg = require('../constants/responseMsg');

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.send(`${resMsg.HELLO}${bot.name}.`);
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(resMsg.ANSWER_TO_EVERYTHING);
    });
  },
};
