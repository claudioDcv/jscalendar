var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/index.html');
});

app.get('/calendario', function (req, res) {
  res.sendFile(__dirname +'/public/calendario.html');
});

app.get('/dia', function (req, res) {
  res.sendFile(__dirname +'/dia.html');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
