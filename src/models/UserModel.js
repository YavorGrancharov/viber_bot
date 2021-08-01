const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    viberId: String,
    name: String,
    avatar: String,
    country: String,
    language: String,
    apiVersion: Number
  },
  {
    timestamps: true,
  }
);

let User = mongoose.model('User', userSchema, 'users');

module.exports = User;
