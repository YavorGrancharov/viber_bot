const ViberBot = require('viber-bot').Bot;

module.exports = () => {
  return new ViberBot({
    authToken: process.env.VIBER_ACCESS_TOKEN,
    name: 'Finance Bot',
    avatar:
      'https://cdn.pixabay.com/photo/2019/06/23/19/15/bitcoin-4294492_960_720.png',
  });
};
