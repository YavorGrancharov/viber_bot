const bot = require('../config/bot')();

module.exports = (router) => {
  router.get('/', function (req, res) {
    res.send(`Hello, I am ${bot.name}.`);
  });
};
