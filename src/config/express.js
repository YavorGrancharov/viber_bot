const express = require('express');
const { ResponseMessage } = require('../constants/responseMessage');

module.exports = (app) => {
  app.use(express.static('node_modules'));

  console.log(ResponseMessage.EXPRESS_READY);
};
