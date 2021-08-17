const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const btcSchema = new Schema(
  {
    price: Number,
  },
  {
    timestamps: true,
  }
);

const BTC = mongoose.model('BTC', btcSchema, 'btc');

module.exports = BTC;
