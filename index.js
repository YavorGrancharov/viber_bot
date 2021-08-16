require('dotenv').config();

const resMsg = require('./src/constants/responseMsg');

if (!process.env.VIBER_ACCESS_TOKEN) {
  console.log(resMsg.MISSING_BOT_ACCOUNT_KEY);
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
require('./src/config/router').get(router);
require('./src/config/router').post(router);
require('./scheduler')();

require('./idle')(process.env.WEBHOOK_URL);

app.use('/', router);
app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, async () => {
  try {
    console.log(`${resMsg.APP_RUNNING_ON_PORT}: ${settings.port}`);
    bot.setWebhook(`${process.env.WEBHOOK_URL}/viber/webhook`);
  } catch (error) {
    console.log(resMsg.CANNOT_SET_WEBHOOK);
    console.error(error);
    process.exit(1);
  }
});
