const { Schema, model } = require('mongoose');
const UserSchema = Schema;

let userSchema = new UserSchema(
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

let User = model('User', userSchema, 'users');

module.exports = User;
