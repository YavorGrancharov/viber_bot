const User = require('../models/user.model');

async function saveUserToDb(response) {
  const { id, name, avatar, country, language, apiVersion } =
    response.userProfile;
  const user = await User.findOne({ viberId: { $eq: id } });
  if (!user) {
    return User.create({
      viberId: id,
      name: name,
      avatar: avatar,
      country: country,
      language: language,
      apiVersion: apiVersion,
    })
      .then((user) => user)
      .catch((error) => console.log(error));
  }
}

async function getAllUsersFromDb() {
  return await User.find({}, (err, doc) => {
    if (err) {
      console.log(err);
      return;
    }
    return doc;
  });
}

async function deleteUserFromDb(id) {
  return await User.findOneAndDelete(
    {
      viberId: { $eq: id },
    },
    (err, doc) => {
      if (err) {
        console.log(err);
        return;
      }
      return doc;
    }
  );
}

module.exports = {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
};
