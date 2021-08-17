const { Schema, model } = require('mongoose');
const BtcSchema = Schema;

const btcSchema = new BtcSchema(
  {
    price: Number,
  },
  {
    timestamps: true,
  }
);

const BTC = model('BTC', btcSchema, 'btc');

module.exports = BTC;
