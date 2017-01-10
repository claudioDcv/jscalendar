// app.js
var express = require('express');
var app = module.exports.app = exports.app = express();


app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/index.html');
});
//you won't need 'connect-livereload' if you have livereload plugin for your browser
app.use(require('connect-livereload')());
