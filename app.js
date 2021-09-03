require('dotenv').config();

const { MISSING_BOT_ACCOUNT_KEY, APP_RUNNING_ON_PORT, CANNOT_SET_WEBHOOK } =
  require('./src/constants/response.message').ResponseMessage;

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
const bot = require('./src/config/bot.config')();
require('./src/controllers/bot.controller').onConversationStarted(bot);
require('./src/controllers/bot.controller').onMessageReceived(bot);
require('./src/controllers/bot.controller').onTextMessage(bot);
require('./src/controllers/bot.controller').onUnsubscribe(bot);
require('./src/controllers/bot.controller').onSubscribe(bot);
require('./src/controllers/bot.controller').onError(bot);

// Create server
const express = require('express');
const router = express.Router();
const env = process.env.NODE_ENV || 'development';
const settings = require('./src/config/settings.config')[env];

const app = express();

require('./src/config/database.config')(settings);
require('./src/config/express.config')(app);
require('./src/config/router.config').get(router);
require('./src/config/router.config').post(router);
require('./scheduler')();

// require('./idle')(process.env.WEBHOOK_URL);

app.use('/', router);
app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, async () => {
  try {
    const publicUrl = await getPublicUrl();
    console.log(`Application running on port: ${settings.port}`);
    console.log('publicUrl => ', publicUrl);
    bot.setWebhook(`${publicUrl}/viber/webhook`);
    // console.log(`${APP_RUNNING_ON_PORT}: ${settings.port}`);
    // bot.setWebhook(`${process.env.WEBHOOK_URL}/viber/webhook`);
  } catch (error) {
    console.log(CANNOT_SET_WEBHOOK);
    console.error(error);
    process.exit(1);
  }
});
