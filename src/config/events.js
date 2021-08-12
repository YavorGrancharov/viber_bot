const unirest = require('unirest');

module.exports = () => {
  const data = {
    url: `${process.env.WEBHOOK_URL}/viber/webhook`,
    event_types: ['delivered', 'seen', 'failed'],
  };

  return unirest
    .post('https://chatapi.viber.com/pa/set_webhook')
    .headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Viber-Auth-Token': process.env.VIBER_ACCESS_TOKEN,
    })
    .send(data)
    .then((response) => {
      const action = response.body;
      console.log(action)
    })
    .catch((err) => {
      console.log(err);
    });
};
