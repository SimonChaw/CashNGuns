var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var game = require('./game');
var player = require('./player');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var newGame = new game.Game();
var player1 = new player.Player();
var player2 = new player.Player();
let currentPlayer;
newGame.join(player1);
newGame.join(player2);
newGame.setup();
newGame.start();

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function(d) {
  if (d === 'P1') {
    currentPlayer = player1
    console.log('Inputing for Player 1')
  } else if (d === 'P2'){
    currentPlayer = player2
    console.log('Inputing for Player 2')
  } else {
    newGame.currentFunction(currentPlayer, d)
  }
});

module.exports = app;
