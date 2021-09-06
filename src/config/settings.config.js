require('dotenv').config();
const path = require('path');
let rootPath = path.normalize(path.join(__dirname, '/../../'));

module.exports = {
  development: {
    rootPath: rootPath,
    db: process.env.MONGODB_URI_DEV,
    port: process.env.PORT || 3000,
  },
  staging: {},
  production: {
    port: process.env.PORT,
    db: process.env.MONGODB_URI
  },
};