const User = require('../models/UserModel');

async function saveUserToDb(userProfile) {
  const { id, name, avatar, country, language, apiVersion } = userProfile;
  try {
    const user = await User.findOne({ viberId: id })
    if (!user) {
      User.create({
        viberId: id,
        name: name,
        avatar: avatar,
        country: country,
        language: language,
        apiVersion: apiVersion,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllUsers() {
  return await User.find({}).lean();
}

module.exports = {
  saveUserToDb,
  getAllUsers,
};
