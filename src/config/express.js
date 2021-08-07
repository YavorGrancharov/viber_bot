const express = require('express');

module.exports = (app) => {
    
  app.use(express.static('node_modules'));

  console.log('Express ready!');
};