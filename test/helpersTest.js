const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    userID: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    userID: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert(user === expectedUserID, "they were not the same");
  });
  it('should return undefined if email is not in database', function () {
    const user = getUserByEmail("user3@example.com", testUsers);
    const expected = undefined;
    assert(user === undefined, "return was not undefined");
    
  });
});