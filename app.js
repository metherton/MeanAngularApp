var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var twilio = require('twilio');


var routes = require('./routes/index');
var users = require('./routes/users');
var agents = require('./routes/agents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/agents', agents);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.title = 'myApp';

module.exports = app;


//var accountSid = 'AC57a1f7edfa716a2799f8166910fc2e19';
//var signingKeySid = 'SK3d043b705d51122d65f2bf7a35f1fa01';
//var signingKeySecret = 'm6IlLsEW7r5DJNPnzD9zV485tgzRg3xM';
//
//var token = new twilio.AccessToken(signingKeySid, accountSid, signingKeySecret);
//token.addEndpointGrant('bob');
//token.enableNTS();
//console.log(token.toJwt());