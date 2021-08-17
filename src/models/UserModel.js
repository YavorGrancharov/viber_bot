const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
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

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
