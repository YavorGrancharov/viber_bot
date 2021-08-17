const { saveUserToDb, getAllUsersFromDb } = require('../api/usersApi');

module.exports = {
  saveUser: (response) => {
    const user = response.userProfile;
    saveUserToDb(user);
  },
  getAllUsers: async () => {
    const users = await getAllUsersFromDb();
    return users;
  },
};
