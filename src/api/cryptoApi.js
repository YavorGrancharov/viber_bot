const { getTicker } = require('../helpers/helper');
const { BTC, ETH, XBTUSD, ETHUSD } =
  require('../constants/requestMessage').RequestMessage;

async function getPriceFromDb(model) {
  let price;
  price = await model.find({}).limit(1).sort({ $natural: -1 });
  price = price[0].price;
  return price;
}

async function getCurrentPrice(crypto) {
  let currentPrice;
  switch (crypto) {
    case BTC:
      currentPrice = await getTicker(XBTUSD);
      currentPrice = Number(currentPrice.XXBTZUSD.a[0]);
      break;
    case ETH:
      currentPrice = await getTicker(ETHUSD);
      currentPrice = Number(currentPrice.XETHZUSD.a[0]);
      break;
  }
  return currentPrice;
}

async function savePriceToDb(model, crypto) {
  model
    .find({})
    .limit(1)
    .sort({ $natural: -1 })
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const currentPrice = await getCurrentPrice(crypto);
      if (data.length !== 0) {
        const priceId = data[0]._id;
        _deletePrevPrice(model, priceId);
        _saveLatestPrice(model, currentPrice);
      } else {
        _saveLatestPrice(model, currentPrice);
      }
    });
}

async function _saveLatestPrice(model, currentPrice) {
  return model.create({
    price: currentPrice,
  });
}

async function _deletePrevPrice(model, _id) {
  return model.findByIdAndDelete(_id);
}

module.exports = {
  savePriceToDb,
  getPriceFromDb,
  getCurrentPrice,
};
