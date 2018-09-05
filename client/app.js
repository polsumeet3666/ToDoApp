var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var config = require('./config.json');
var mongoose = require('mongoose');

var session = require('express-session');

//mongodb schema
var UserSchema = require('./models/userSchema');
var UserModel = null;

// mongodb connection
var mongoClient = mongoose.createConnection(config.dburl, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('error :: mongodb not running');
    console.error(err);
    process.exit(0);
  }
  console.log("info :: Server up and running on port 3000");
  console.log("info :: mongodb up and running on port 27017");
});

//init mongodb model
global.mongoClient = mongoClient;

var app = express();

//session for non prod
app.use(session(
  {
    secret: 'keyboard cat',
    cookie: {}
  }
));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//global auth handler
// app.use('/users',(req,res,next)=>{
//   if (req.session && req.session.user){
//      next();
//   }
//   else {
//     res.redirect('/');
//   }
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
