const express = require('express');
const compression = require('compression');

const { EXPRESS_READY } =
  require('../constants/responseMessage').ResponseMessage;

module.exports = (app) => {
  app.use(compression());
  app.use(express.static('node_modules'));

  console.log(EXPRESS_READY);
};
