const urlsForUser = function(id, database){
  let userUrl = {};
  
for (let key in database) {
  if (database[key].userID === id) {
    userUrl[key] = database[key].longURL

  }
  
}
return userUrl;
};

const getUserByEmail = function(email, database) {
  let user;
  for (let key in database) {
    if (database[key].email === email) {
      user = database[key].userID;
  
    }
  }
  return user;
};

function generateRandomString() {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for ( var i = 0; i < 6; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
};

module.exports = { urlsForUser, getUserByEmail, generateRandomString };