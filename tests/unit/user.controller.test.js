const usersApi = require('../../src/api/users.api');
const User = require('../../src/models/user.model');
const httpMocks = require('node-mocks-http');
const response = require('../mock/response.json');

User.findOne = jest.fn();
User.findOneAndDelete = jest.fn();

let consoleSpy = jest.spyOn(console, 'log').mockImplementation();
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe('usersApi.saveUserToDb', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('Test: should have a saveUser function', () => {
    expect(typeof usersApi.saveUserToDb).toBe('function');
  });
  it('Test: should call User.findOne', () => {
    req.body = response;
    usersApi.saveUserToDb(req.body);
    expect(User.findOne).toBeCalledTimes(1);
  });
});

describe('usersApi.deleteUserFromDb', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('Test: should have a saveUser function', () => {
    expect(typeof usersApi.deleteUserFromDb).toBe('function');
  });
  it('Test: should call User.findOneAndDelete', () => {
    req.body = response.userProfile.id;
    const user = usersApi.deleteUserFromDb(req.body);
    console.log('Hello');
    consoleSpy.mockRestore();
    expect(User.findOneAndDelete).toBeCalledTimes(1);
  });
});
