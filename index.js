require('dotenv').config();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const TextMessage = require('viber-bot').Message.Text;
const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const ethController = require('./src/controllers/consolidator').ethereum;
const btcController = require('./src/controllers/consolidator').bitcoin;
const helper = require('./src/helpers/helper');

const cron = require('node-cron');

if (!process.env.VIBER_ACCESS_TOKEN) {
  console.log('Could not find bot account token key.');
  return;
}

const ngrok = require('./get_public_url');

const bot = new ViberBot({
  authToken: process.env.VIBER_ACCESS_TOKEN,
  name: 'Finance Bot',
  avatar:
    'https://cdn.pixabay.com/photo/2019/06/23/19/15/bitcoin-4294492_960_720.png',
});

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
        `Pleace type \'Hi\' to see BTC and ETH buttons.`
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

// Save latest ETH, BTC prices to DB on every 24h
cron.schedule('30 17 * * *', async () => {
  btcController.savePrice();
  ethController.savePrice();
  
  msgController.sendSubscribersDailyMsg(
    userController,
    btcController,
    ethController
  );
});

// Server
const express = require('express');
const env = process.env.NODE_ENV || 'development';
const settings = require('./src/config/settings')[env];

const app = express();

require('./src/config/database')(settings);

app.get('/', function (req, res) {
  res.send(`Hello, I am ${bot.name}.`);
});

app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, () => {
  try {
    console.log(`Application running on port: ${settings.port}`);
    bot.setWebhook(`https://vbr-bot.herokuapp.com/viber/webhook`);
  } catch (error) {
    console.log('Can not set webhook on following server.');
    console.error(error);
    process.exit(1);
  }
});
