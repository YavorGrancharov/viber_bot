const express = require('express');
const resMsg = require('../constants/responseMsg');

module.exports = (app) => {
  app.use(express.static('node_modules'));

  console.log(resMsg.EXPRESS_READY);
};
