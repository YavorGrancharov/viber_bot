const unirest = require('unirest');

module.exports = (url) => {
  setInterval(() => {
    unirest
      .post(url)
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .send({})
      .then((response) => {
        console.log(response.body);
      })
      .catch((error) => {
        console.log(error);
      });
  }, 20 * 60 * 1000);
};
