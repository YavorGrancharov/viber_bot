const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = (settings) => {
  mongoose.set('useCreateIndex', true);
  mongoose.connect(settings.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: false,
    useFindAndModify: false,
  });
  console.log(typeof settings.db)
  let db = mongoose.connection;

  db.once('open', (err) => {
    if (err) {
      throw err;
    }

    console.log('MongoDB ready!');
  });

  db.on('error', (err) => console.log(`Database error: ${err}`));
};