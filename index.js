require('dotenv').config();

const { MISSING_BOT_ACCOUNT_KEY, APP_RUNNING_ON_PORT, CANNOT_SET_WEBHOOK } =
  require('./src/constants/responseMessage').ResponseMessage;

if (!process.env.VIBER_ACCESS_TOKEN) {
  console.log(MISSING_BOT_ACCOUNT_KEY);
  return;
}

process.on('unhandledRejection', (reason, promise) => {
  console.log(
    `Unhandled Rejection at: Promise ${promise.catch((error) =>
      console.log(error)
    )} with reason: ${reason.name}`
  );
});

const { getPublicUrl } = require('./publicUrl');

// Initialize bot
const bot = require('./src/config/bot')();
require('./src/controllers/botController').onConversationStarted(bot);
require('./src/controllers/botController').onMessageReceived(bot);
require('./src/controllers/botController').onTextMessage(bot);
require('./src/controllers/botController').onUnsubscribe(bot);
require('./src/controllers/botController').onSubscribe(bot);
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

// require('./idle')(process.env.WEBHOOK_URL);

app.use('/', router);
app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, async () => {
  try {
    console.log(`${APP_RUNNING_ON_PORT}: ${settings.port}`);
    bot.setWebhook(`${process.env.WEBHOOK_URL}/viber/webhook`);
  } catch (error) {
    console.log(CANNOT_SET_WEBHOOK);
    console.error(error);
    process.exit(1);
  }
});
