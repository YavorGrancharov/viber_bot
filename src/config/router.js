const bot = require('../config/bot')();

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.send(`Hello, I am ${bot.name}.`);
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(`The answer to everything is 42.`);
    });
  },
};
