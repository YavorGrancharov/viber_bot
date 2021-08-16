const mongoose = require('mongoose');
const { ResponseMessage } = require('../constants/responseMessage');

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

    console.log(ResponseMessage.MONGODB_READY);
  });

  db.on('error', (err) =>
    console.log(`${ResponseMessage.DATABASE_ERROR}${err}`)
  );
};
