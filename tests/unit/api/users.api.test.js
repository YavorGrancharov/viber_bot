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
jest.setTimeout(10000);

let log = jest.spyOn(console, 'log').mockImplementation(() => {});
let req, res, next;

describe('Users api test', () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('Should have a saveUser function', () => {
    expect(typeof saveUserToDb).toBe('function');
  });
  it('Should call User.findOne', () => {
    req.body = response;
    log(req.body.userProfile);
    expect(log).toBeCalledWith(req.body.userProfile);
    log.mockReset();
    saveUserToDb(req.body);
    expect(User.findOne).toBeCalledTimes(1);
  });
  it('Should call User.create', () => {
    expect(User.create).toBeCalledTimes(1);
  });
  it('Should return json body', async () => {
    User.create.mockReturnValue(response.userProfile);
    const user = await User.create(response.userProfile);
    expect(user).toStrictEqual(response.userProfile);
  });
  it('Should call User.find', () => {
    getAllUsersFromDb();
    expect(User.find).toBeCalledTimes(1);
  });
  it('Test: should have a saveUser function', () => {
    expect(typeof deleteUserFromDb).toBe('function');
  });
  it('Test: should call User.findOneAndDelete', () => {
    req.body = response.userProfile.id;
    deleteUserFromDb(req.body);
    expect(User.findOneAndDelete).toBeCalledTimes(1);
  });
});
