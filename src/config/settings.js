
const path = require('path');
let rootPath = path.normalize(path.join(__dirname, '/../../'));

module.exports = {
  development: {
    rootPath: rootPath,
    db: "mongodb+srv://yavor:$agittarius791202@ascrmi-kzgsb.mongodb.net/vbr_chatbot?retryWrites=true&w=majority",
    port: process.env.PORT || 3000,
  },
  staging: {},
  production: {
    port: process.env.PORT,
    db: process.env.MONGODB_URI
  },
};