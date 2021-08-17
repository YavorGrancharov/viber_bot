const mongoose = require('mongoose');
const { MONGODB_READY, DATABASE_ERROR } =
  require('../constants/responseMessage').ResponseMessage;

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

    console.log(MONGODB_READY);
  });

  db.on('error', (err) => console.log(`${DATABASE_ERROR}${err}`));
};
