const { Schema, model } = require('mongoose');
const EthSchema = Schema;

const ethSchema = new EthSchema(
  {
    price: Number,
  },
  {
    timestamps: true,
  }
);

const ETH = model('ETH', ethSchema, 'eth');

module.exports = ETH;
