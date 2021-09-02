const {
  saveUserToDb,
  getAllUsersFromDb,
  deleteUserFromDb,
} = require('../../../src/api/users.api');
const User = require('../../../src/models/user.model');
const httpMocks = require('node-mocks-http');
const response = require('../../mock/response.json');

User.findOne = jest.fn();
User.findOneAndDelete = jest.fn();
User.create = jest.fn().mockImplementation(() => Promise.resolve());
User.find = jest.fn().mockImplementation(() => Promise.resolve());

jest.useFakeTimers();
jest.setTimeout(100000);

let log = jest.spyOn(console, 'log').mockImplementation(() => {});
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('usersApi.saveUserToDb', () => {
  it('Test: should have a saveUser function', () => {
    expect(typeof saveUserToDb).toBe('function');
  });
  it('Test: should call User.findOne', () => {
    req.body = response;
    log(req.body.userProfile);
    expect(log).toHaveBeenCalledWith(req.body.userProfile);
    log.mockReset();
    saveUserToDb(req.body);
    expect(User.findOne).toBeCalledTimes(1);
  });
  it('Test: should call User.create', () => {
    expect(User.create).toBeCalledTimes(1);
  });
});

describe('usersApi.getAllUsersFromDb', () => {
  it('Test: should call User.find', () => {
    getAllUsersFromDb();
    expect(User.find).toBeCalledTimes(1);
  });
});

describe('usersApi.deleteUserFromDb', () => {
  it('Test: should have a saveUser function', () => {
    expect(typeof deleteUserFromDb).toBe('function');
  });
  it('Test: should call User.findOneAndDelete', () => {
    req.body = response.userProfile.id;
    deleteUserFromDb(req.body);
    expect(User.findOneAndDelete).toBeCalledTimes(1);
  });
});
