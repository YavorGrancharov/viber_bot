const BtcModel = require('../models/BtcModel');
const helper = require('../helpers/helper');

async function saveLatestPrice(currentPrice, oldPrice) {
  if (currentPrice !== oldPrice) {
    return BtcModel.create({
      price: currentPrice,
    });
  }
}

async function getPriceFromDb() {
  let price = await BtcModel.find({}).limit(1).sort({ $natural: -1 });
  price = price[0].price;
  return price;
}

async function getCurrentPrice() {
  let currentPrice = await helper.getTicker('XBTUSD');
  currentPrice = Number(currentPrice.XXBTZUSD.a[0]);
  return currentPrice;
}

async function deletePrevPrice(_id) {
  return BtcModel.findByIdAndDelete(_id);
}

async function savePriceToDb() {
  BtcModel.find({})
    .limit(1)
    .sort({ $natural: -1 })
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const currentPrice = await getCurrentPrice();
      if (data.length !== 0) {
        const price = data[0].price;
        const priceId = data[0]._id;
        saveLatestPrice(currentPrice, price);
        deletePrevPrice(priceId);
      } else {
        saveLatestPrice(currentPrice, null);
      }
    });
}

module.exports = {
  savePriceToDb,
  getPriceFromDb,
  getCurrentPrice,
};
