require('dotenv').config();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const User = require('./src/models/UserModel');

const TextMessage = require('viber-bot').Message.Text;
const userController = require('./src/controllers/consolidator').user;
const msgController = require('./src/controllers/consolidator').message;
const ethController = require('./src/controllers/consolidator').ethereum;
const btcController = require('./src/controllers/consolidator').bitcoin;
const helper = require('./src/helpers/helper');

const cron = require('node-cron');

let broadcastList = [];

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

async function sendDailyPriceToSubscribers() {
  let currentEthPrice = await helper.getTicker('ETHUSD');
  currentEthPrice = Number(currentEthPrice.XETHZUSD.a[0]);
  let currentBtcPrice = await helper.getTicker('XBTUSD');
  currentBtcPrice = Number(currentBtcPrice.XXBTZUSD.a[0]);
  let subscribers = await User.find({}).lean();
}

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

bot.on(BotEvents.MESSAGE_SENT, (message, response) => {});

// Save latest ETH, BTC prices to DB on every 24h
cron.schedule('* */24 * * *', () => {
  ethController.savePrice();
  btcController.savePrice();
});

// Server
const express = require('express');
const app = express();
const env = process.env.NODE_ENV || 'development';
const settings = require('./src/config/settings')[env];

require('./src/config/db')(settings);

app.use('/viber/webhook', bot.middleware());
app.listen(settings.port, async () => {
  try {
    const publicUrl = await ngrok.getPublicUrl();
    console.log(`Application running on port: ${settings.port}`);
    console.log('publicUrl => ', publicUrl);
    bot.setWebhook(`${publicUrl}/viber/webhook`);
  } catch (error) {
    console.log('Can not set webhook on following server.');
    console.error(error);
    process.exit(1);
  }
});
