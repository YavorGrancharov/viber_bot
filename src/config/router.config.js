const bot = require('./bot.config')();
const localeService = require('../services/locale.service');

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.render('home/index', {
        locale: localeService.getLocale(),
        hello: localeService.translate('Hello', { name: bot.name }),
      });
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(localeService.translate('Answer_to_everything'));
    });
  },
};
