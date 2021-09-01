const { Schema, model } = require('mongoose');
const UserSchema = Schema;

const userSchema = new UserSchema(
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

const User = model('User', userSchema, 'users');

module.exports = User;
