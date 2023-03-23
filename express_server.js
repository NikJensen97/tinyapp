const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");

const urlDatabase = {

};
let loginStatus = false;

const users = {



};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// creates main page
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlsForUser(req.cookies.user_id),
    users,
    username: req.cookies.user_id,
    loginStatus
  };
  res.render("urls_index", templateVars);
});

// creates page to make new URLs
app.get("/urls/new", (req, res) => {
  const templateVars = {
    users,
    username: req.cookies.user_id,
    loginStatus
  };
  if (!loginStatus) {
    res.redirect(`/urls/login`);
    return;
  }
  res.render("urls_new", templateVars);
});
// creates registration page
app.get("/urls/register", (req, res) => {
 const templateVars = {
  users,
  username: req.cookies.user_id,
  loginStatus
 }
 if (loginStatus) {
  res.redirect(`/urls`);
}
res.render("urls_register", templateVars)
});

app.get("/urls/login", (req, res) => {
  const templateVars = {
   users,
   username: req.cookies.user_id,
   loginStatus
  }
  if (loginStatus) {
    res.redirect(`/urls`);
  }
 res.render("urls_login", templateVars)
 });

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: `${urlDatabase[req.params.id].longURL}`, 
    users,
    username: req.cookies.user_id,
    loginStatus
    };
    if (!urlDatabase[req.params.id]) {
      res.status(400).send('page does not exist');
    }
    if (!loginStatus) {
      res.status(401).send('You must be logged in to see this page');
    }
    if (req.cookies.user_id !== urlDatabase[req.params.id].userID) {
      res.status(401).send('Only the user who made this URL can see this');
    }
  res.render("urls_show", templateVars);
});

// adds new URL and creates a random short URL for it
app.post("/urls", (req, res) => {
  if (!loginStatus) {
    res.status(401).send('You must be logged in to use this feature!');
    return;
  }

  console.log(req.body); // Log the POST request body to the console
  const newID = generateRandomString();
  urlDatabase[newID] = {
    "longURL": req.body.longURL,
    "userID": req.cookies.user_id
  }
  res.redirect(`/urls/${newID}`);
});
// replaces a long url with an edit from user
app.post("/urls/:id", (req, res) => {
  if (!loginStatus) {
    res.status(401).send('You must be logged in to use this feature!');
    return;
  }
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Could not find URL to edit');
    return;
   }
  if (req.cookies.user_id !== urlDatabase[req.params.id].userID) {
  res.status(401).send('Wrong user to edit this URL');
  return;
 }
 

  console.log(`${req.params.id} changes to ${req.body.newLongURL}`);
  urlDatabase[req.params.id].longURL = req.body.newLongURL;
  res.redirect(`/urls`);
});
// deletes an existing url
app.post("/urls/:id/delete", (req, res) => {
  if (!loginStatus) {
    res.status(401).send('You must be logged in to use this feature!');
    return;
  }
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Could not find URL to delete');
    return;
   }
   if (req.cookies.user_id !== urlDatabase[req.params.id].userID) {
    res.status(401).send('Wrong user to delete this URL');
    return;
  }
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});
// recieves user login input and checks if they are registered

app.post("/login", (req, res) => {
  
  
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('please provide valid email and password');
    return;
  }
  let found = 0;
  for (const key in users) {
    if (users[key]['email'] === email){
      found = 1;
      if (!bcrypt.compareSync(password, users[key]['password'])) {
        res.status(403).send('passwords do not match');
        return;
      }
    res.cookie("user_id", users[key]['username']);
    loginStatus = true;
    res.redirect(`/urls`);
    }
  }
  if (found === 0) {
    res.status(403).send('email not found');
    return;
  }
});


app.post("/urls/:id/edit", (req, res) => {
  console.log(req.params.id);
  res.redirect(`/urls/${req.params.id}`);
});
// logs out user. only works if there are 1 cookie!
app.post("/logout", (req, res) => {
  console.log(Object.keys(req.cookies)[0]);
  res.clearCookie(Object.keys(req.cookies)[0]);
  loginStatus = false;
  res.redirect(`/urls/login`);
});
// logs user registration into users
app.post("/register", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.status(400).send('please provide valid email and password');
    return;
  }
  for (const key in users) {
    if (users[key]['email'] === email){
      res.status(400).send('email entered is already in use');
      return;
    }
  }
  
 const newUser = generateRandomString();
 users[`${newUser}`] = { "username": newUser,
 "email": email,
 "password": hashedPassword
}
  console.log(`new user: ${newUser}`);
  console.log(users);
  res.cookie("user_id", newUser);
  loginStatus = true;
  res.redirect(`/urls`);
});

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = `${urlDatabase[req.params.id]}`;
  res.redirect(longURL);
});

function generateRandomString() {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for ( var i = 0; i < 6; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
};

const urlsForUser = function(id){
  let userUrl = {};
  
for (let key in urlDatabase) {
  if (urlDatabase[key].userID === id) {
    userUrl[key] = urlDatabase[key].longURL

  }
  
}
return userUrl;
};