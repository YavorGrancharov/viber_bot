const { findOne, create, find } = require('../models/UserModel');

async function saveUserToDb(userProfile) {
  const { id, name, avatar, country, language, apiVersion } = userProfile;
  try {
    const user = await findOne({ viberId: id }).lean();
    if (!user) {
      create({
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

async function getAllUsersFromDb() {
  const users = await find({}).lean();
  return users;
}

module.exports = {
  saveUserToDb,
  getAllUsersFromDb,
};
