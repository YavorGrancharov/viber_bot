const mongoose = require('mongoose');
const resMsg = require('../constants/responseMsg');

mongoose.Promise = global.Promise;

module.exports = (settings) => {
  mongoose.connect(settings.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: false,
    useFindAndModify: false,
  });

  let db = mongoose.connection;

  db.once('open', (err) => {
    if (err) {
      throw err;
    }

    console.log(resMsg.MONGODB_READY);
  });

  db.on('error', (err) => console.log(`${resMsg.DATABASE_ERROR}${err}`));
};
