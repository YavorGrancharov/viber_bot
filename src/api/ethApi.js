const EthModel = require('../models/EthModel');
const helper = require('../helpers/helper');

async function saveLatestPrice(currentPrice) {
  return EthModel.create({
    price: currentPrice,
  });
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

async function deletePrevPrice(_id) {
  return EthModel.findByIdAndDelete(_id);
}

async function savePriceToDb() {
  EthModel.find({})
    .limit(1)
    .sort({ $natural: -1 })
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const currentPrice = await getCurrentPrice();
      if (data.length !== 0) {
        const priceId = data[0]._id;
        deletePrevPrice(priceId);
        saveLatestPrice(currentPrice);
      } else {
        saveLatestPrice(currentPrice);
      }
    });
}

module.exports = {
  savePriceToDb,
  getPriceFromDb,
  getCurrentPrice,
};
