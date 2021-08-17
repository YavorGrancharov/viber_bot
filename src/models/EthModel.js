const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ethSchema = new Schema(
  {
    price: Number,
  },
  {
    timestamps: true,
  }
);

const ETH = mongoose.model('ETH', ethSchema, 'eth');

module.exports = ETH;
