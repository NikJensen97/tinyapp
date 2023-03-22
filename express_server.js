const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
    urls: urlDatabase,
    users  
  };
  res.render("urls_index", templateVars);
});
// creates page to make new URLs
app.get("/urls/new", (req, res) => {
  const templateVars = {
    users,
    
  };
  res.render("urls_new", templateVars);
});
// creates registration page
app.get("/urls/register", (req, res) => {
 const templateVars = {
  users,

 }

res.render("urls_register", templateVars)
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: `${urlDatabase[req.params.id]}`, 
    users
    };
  res.render("urls_show", templateVars);
});

// adds new URL and creates a random short URL for it
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const newID = generateRandomString();
  urlDatabase[newID] = req.body.longURL;
  res.redirect(`/urls/${newID}`);
});
// replaces a long url with an edit from user
app.post("/urls/:id", (req, res) => {
  console.log(`${req.params.id} changes to ${req.body.newLongURL}`);
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect(`/urls`);
});
// deletes an existing url
app.post("/urls/:id/delete", (req, res) => {
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});
// recieves user login input and stores to a cookie
app.post("/login", (req, res) => {
  console.log(req.body.username);
  res.cookie("username",req.body.username);
  res.redirect(`/urls`);
});


app.post("/urls/:id/edit", (req, res) => {
  console.log(req.params.id);
  res.redirect(`/urls/${req.params.id}`);
});
// logs out user. only works if there are 1 cookie!
app.post("/logout", (req, res) => {
  console.log(Object.keys(req.cookies)[0]);
  res.clearCookie(Object.keys(req.cookies)[0]);
  res.redirect(`/urls`);
});
// logs user registration into users
app.post("/register", (req, res) => {
 
 const newUser = generateRandomString();
 users['newUser'] = { "username": newUser,
 "email": req.body.email,
 "password": req.body.password
}
  console.log(`new user: ${newUser}`);
  res.cookie("user_id", newUser);
  res.redirect(`/urls`);
  // console.log(user['username'])
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
}
