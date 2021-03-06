const express = require('express');
const compression = require('compression');
const handlebars = require('express-handlebars');
const cors = require('cors');

const i18n = require('../../i18n.config');

const { EXPRESS_READY } =
  require('../constants/response.message').ResponseMessage;

module.exports = (app) => {
  let corsOptions = {
    origin: process.env.WEBHOOK_URL,
    methods: 'GET,POST,DELETE',
    optionsSuccessStatus: 204,
  };

  let hbs = handlebars.create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: ['views/partials'],
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.use(i18n.init);
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.static('static'));
  app.use(express.static('node_modules'));

  console.log(EXPRESS_READY);
};
