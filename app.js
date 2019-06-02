var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
require('dotenv').config();

const config = require('./config');
var jwt = require('jsonwebtoken');
var userModel = require('./models/user.js');
//var appModel = require('./models/apps.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var datos_coi = require('./routes/datos_coi');

app.use(cors());
app.use(session({
  secret: 'abcdefg',
  resave: false,
  saveUninitialized: true
}));

// Auth Middleware
app.use('/app', function(req, res, next){
  var token = req.headers[config.token_name];
  if(!token){
        res.status(401).send({ 
            result: 'error', 
            message: 'No token provided.' 
        });
    } else {
        jwt.verify(token, process.env.APP_SECRET, async function(error, decoded) {
            if (error){
                res.status(401).send({ 
                    result: 'error', 
                    message: 'Failed to authenticate token.' 
                });
            }        
            
            next();
        });
    }
});



app.use('/', index);
app.use('/app/users', users);
app.use('/auth', auth);
app.use('/app/datos_coi', datos_coi);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
