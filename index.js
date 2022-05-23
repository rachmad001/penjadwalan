require('dotenv').config()
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('./controller/UserController'));
app.use(require('./controller/KalenderController'));
app.use(require('./controller/AccessController'));
app.use(require('./controller/JadwalController'));

app.listen(3000);