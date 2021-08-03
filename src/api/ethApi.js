const EthModel = require('../models/EthModel');
const helper = require('../helpers/helper');

async function priceComparator(currentPrice, oldPrice, model) {
  if (currentPrice !== oldPrice) {
    await model.create({
      price: currentPrice,
    });
  }
}

async function getPriceFromDb() {
  let price = await EthModel.find({}).limit(1).sort({ $natural: -1 });
  price = price[0].price;
  return price;
}

async function getCurrentPrice() {
  let currentPrice = await helper.getTicker('ETHUSD');
  currentPrice = Number(currentPrice.XETHZUSD.a[0]);
  return currentPrice;
}

async function savePriceToDb() {
  let currentPrice = await getCurrentPrice();
  let latestPriceFromDb = await getPriceFromDb();
  priceComparator(currentPrice, latestPriceFromDb, EthModel);
}

module.exports = {
  savePriceToDb,
  getPriceFromDb,
  getCurrentPrice,
};
