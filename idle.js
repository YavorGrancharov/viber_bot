const helper = require('./src/helpers/helper');

module.exports = (url) => {
  setInterval(() => {
    helper.request('POST', url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }, 20 * 60 * 1000);
};
