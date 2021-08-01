const usersApi = require('../api/usersApi');

module.exports = {
  saveUser: (response) => {
    const user = response.userProfile;
    usersApi.saveUserToDb(user);
  },
};
