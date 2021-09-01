const {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
} = require('../api/users.api');

module.exports = {
  saveUser: (response) => {
    const user = response;
    return saveUserToDb(user)
      .then((user) => user)
      .catch((error) => console.log(error));
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
