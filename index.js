require('dotenv').config();
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;

const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const ethController = require('./src/controllers/consolidator').ethereum;
const btcController = require('./src/controllers/consolidator').bitcoin;
const helper = require('./src/helpers/helper');

if (!process.env.VIBER_ACCESS_TOKEN) {
  console.log('Could not find bot account token key.');
  return;
}

const ngrok = require('./publicUrl');
const bot = require('./src/config/bot');

bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
  if (!(message instanceof TextMessage)) {
    msgController.sendTextMsg(
      response,
      `Sorry. I can only understand text messages.`
    );
  }

  if (message instanceof TextMessage) {
    if (message.text === 'Hi') {
      msgController.sendKeyboardMsg(response);
    } else {
      msgController.sendTextMsg(
        response,
        `Please type \'Hi\' to see BTC and ETH buttons.`
      );
    }

    if (message.text === 'BTC') {
      const btcPriceOnDemand = await btcController.currentPrice();
      const dbPrice = await btcController.latestPriceFromDb();
      const diff = helper.calcPriceDiff(btcPriceOnDemand, dbPrice);
      msgController.sendRichMediaMsg(response, 'BTC', btcPriceOnDemand, diff);
    }

    if (message.text === 'ETH') {
      const ethPriceOnDemand = await ethController.currentPrice();
      const dbPrice = await ethController.latestPriceFromDb();
      const diff = helper.calcPriceDiff(ethPriceOnDemand, dbPrice);
      msgController.sendRichMediaMsg(response, 'ETH', ethPriceOnDemand, diff);
    }

    userController.saveUser(response);
    msgController.sendTextMsg(response);
  }
});

// Server
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
