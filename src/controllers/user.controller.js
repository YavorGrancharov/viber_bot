const {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
} = require('../api/users.api');

module.exports = {
  saveUser: (response) => {
    try {
      const user = response.userProfile;
      saveUserToDb(user);
    } catch (error) {
      console.log(error);
    }
  },
  getAllUsers: () => {
    return getAllUsersFromDb()
      .then((users) => users)
      .catch((error) => console.log(error));
  },
  deleteUser: (id) => {
    return deleteUserFromDb(id)
      .then((user) => user)
      .catch((error) => console.log(error));
  },
};
