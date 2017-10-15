var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var routes  = require('./routes');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');

var Web3 = require('web3');
var web3 = new Web3();
console.log('web3.version', web3.version);

var app = express();


mongoose.connect('mongodb://localhost/traidhf');
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
app.set('port', process.env.PORT || 4005)
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/build')));
app.use('/', routes);


app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
