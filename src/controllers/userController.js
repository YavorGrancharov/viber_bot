const {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
} = require('../api/usersApi');

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
    getAllUsersFromDb()
      .then((users) => users)
      .catch((error) => console.log(error));
  },
  deleteUser: (id) => {
    deleteUserFromDb(id)
      .then((user) => user)
      .catch((error) => console.log(error));
  },
};
