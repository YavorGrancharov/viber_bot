const bot = require('./bot.config')();
const localeService = require('../services/locale.service');
const randomJoke = require('one-liner-joke');

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.render('home/index', {
        locale: localeService.getLocale(),
        hello: localeService.translate('Hello', {
          name: bot.name,
        }),
        newgame: localeService.translate('Restart_game'),
        conversation: localeService.translate('Start_new_conversation'),
        option: localeService.translate('or'),
        joke: randomJoke.getRandomJoke({
          exclude_tags: ['dirty', 'racist', 'marriage'],
        }).body,
      });
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res.status(200).send(localeService.translate('Answer_to_everything'));
    });
  },
};
