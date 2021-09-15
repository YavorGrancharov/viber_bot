const bot = require('./bot.config')();
const localeService = require('../services/locale.service');
const randomJoke = require('one-liner-joke');

module.exports = {
  get: (router) => {
    router.get('/', function (req, res) {
      res.render('home/index', {
        locale: process.env.LOCALE,
        hello: localeService.translate(process.env.LOCALE, 'Hello', {
          name: bot.name,
        }),
        newgame: localeService.translate(process.env.LOCALE, 'Restart_game'),
        open: localeService.translate(process.env.LOCALE, 'Open_viber'),
        send: localeService.translate(process.env.LOCALE, 'Send_invite'),
        scan: localeService.translate(
          process.env.LOCALE,
          'Start_new_conversation'
        ),
        or: localeService.translate(process.env.LOCALE, 'or'),
        game: localeService.translate(process.env.LOCALE, 'Tic_tac_toe'),
        joke: randomJoke.getRandomJoke({
          exclude_tags: ['dirty', 'racist', 'marriage'],
        }).body,
      });
    });
  },
  post: (router) => {
    router.post('/', function (req, res) {
      res
        .status(200)
        .send(
          localeService.translate(process.env.LOCALE, 'Answer_to_everything')
        );
    });
  },
};
