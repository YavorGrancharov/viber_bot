const helper = require('../helpers/helper');

async function saveLatestPrice(model, currentPrice) {
  return model.create({
    price: currentPrice,
  });
}

async function getPriceFromDb(model) {
  let price;
  price = await model.find({}).limit(1).sort({ $natural: -1 });
  price = price[0].price;
  return price;
}

async function getCurrentPrice(crypto, reqMsg) {
  let currentPrice;
  switch (crypto) {
    case reqMsg.BTC:
      currentPrice = await helper.getTicker(reqMsg.XBTUSD);
      currentPrice = Number(currentPrice.XXBTZUSD.a[0]);
      break;
    case reqMsg.ETH:
      currentPrice = await helper.getTicker(reqMsg.ETHUSD);
      currentPrice = Number(currentPrice.XETHZUSD.a[0]);
      break;
  }
  return currentPrice;
}

async function deletePrevPrice(model, _id) {
  return model.findByIdAndDelete(_id);
}

async function savePriceToDb(model, crypto, reqMsg) {
  model
    .find({})
    .limit(1)
    .sort({ $natural: -1 })
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const currentPrice = await getCurrentPrice(crypto, reqMsg);
      if (data.length !== 0) {
        const priceId = data[0]._id;
        deletePrevPrice(model, priceId);
        saveLatestPrice(model, currentPrice);
      } else {
        saveLatestPrice(model, currentPrice);
      }
    });
}

module.exports = {
  savePriceToDb,
  getPriceFromDb,
  getCurrentPrice,
};
