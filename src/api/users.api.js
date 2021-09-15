const User = require('../models/user.model');

async function saveUserToDb(response) {
  return new Promise(async (resolve, reject) => {
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
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    }
  });
}

async function getAllUsersFromDb() {
  return new Promise(async (resolve, reject) => {
    return await User.find({}, (err, doc) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
}

async function deleteUserFromDb(id) {
  return new Promise(async (resolve, reject) => {
    return await User.findOneAndDelete(
      {
        viberId: { $eq: id },
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(doc);
      }
    );
  });
}
async function getUserByViberId(id) {
  return new Promise(async (resolve, reject) => {
    return await User.findOne({ viberId: id }, (err, doc) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
}

module.exports = {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
  getUserByViberId
};
