const bot = require('../config/bot')();
const { HELLO, ANSWER_TO_EVERYTHING } =
  require('../constants/responseMessage').ResponseMessage;

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.send(`${HELLO}${bot.name}.`);
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(ANSWER_TO_EVERYTHING);
    });
  },
};
