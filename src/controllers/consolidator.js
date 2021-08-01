const user = require('./userController');
const message = require('./msgController');
const ethereum = require('./ethController');
const bitcoin = require('./btcController');

module.exports = {
  user,
  message,
  ethereum,
  bitcoin,
};
