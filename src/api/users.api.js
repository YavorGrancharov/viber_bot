const User = require('../models/user.model');

async function saveUserToDb(response) {
  const { id, name, avatar, country, language, apiVersion } = response.userProfile;
  const user = await User.findOne({ viberId: { $eq: id } }).lean();
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
  return await User.find({}).lean();
}

async function deleteUserFromDb(id) {
  await User.findOneAndDelete(
    {
      viberId: { $eq: id },
    },
    (err, doc) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return null, doc;
      }
    }
  ).lean();
}

module.exports = {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
};
