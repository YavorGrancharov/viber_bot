require('dotenv').config();

if (!process.env.VIBER_ACCESS_TOKEN) {
  console.log('Could not find bot account token key.');
  return;
}

const ngrok = require('./publicUrl');

// Initialize bot
const bot = require('./src/config/bot')();
require('./src/controllers/botController').onMessageReceived(bot);
require('./src/controllers/botController').onSubscribed(bot);
require('./src/controllers/botController').onError(bot);

// Create server
const express = require('express');
const router = express.Router();
const env = process.env.NODE_ENV || 'development';
const settings = require('./src/config/settings')[env];

const app = express();

require('./src/config/database')(settings);
require('./src/config/express')(app);
require('./src/config/router')(router);
require('./scheduler')();

app.use('/', router);
app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, async () => {
  try {
    console.log(`Application running on port: ${settings.port}`);
    bot.setWebhook(`https://vbr-bot.herokuapp.com/viber/webhook`);
  } catch (error) {
    console.log('Can not set webhook on following server.');
    console.error(error);
    process.exit(1);
  }
});
