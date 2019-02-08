var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const Player = require('./player');
const AI_Player = require('./ai_player');
const Game = require('./game.js')
/*
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
*/
/*
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
*/
server.listen(4200);
let messages = []
let game = new Game();
io.on('connection', function(client) {

    console.log('Client connected...');

    client.on('create game', function(){
        console.log('This players room is:');
        console.log(client.rooms);
    });

    client.emit('messages', messages)

    client.on('join game', function(data) {
        let player = new Player(data.name)
        game.join(player)
        io.emit('player manifest', game.get_player_manifest());
    });

    client.on('start game', function(){
        game.setup();
        game.start();
        io.emit('game message', {name: 'Game Message', message: 'The game has started.'});
        io.emit('setup round', game.prepare_game_manifest());
    })

    client.on('add ai player', function(){
        if (game.players.length < 8) {
          let player = new AI_Player();
          game.join(player);
          io.emit('game message', {name: 'Game Message' , message: 'AI Player added.'})
          io.emit('player manifest', game.get_player_manifest());
        } else {
          io.emit('game message', {name: 'Game Message' , message: 'There cannot be more than 8 players.'})
        }
    });

    client.on('remove ai player', function(){
        let playerRemoved = false;
        game.players.forEach((player, index) => {
          if (! player.human) {
            game.players.splice(index, 1)
            client.emit('game message', {name: 'Game Message' , message: 'AI Player removed.'})
            playerRemoved = true;
            io.emit('player manifest', game.get_player_manifest());
            return;
          }
        })
        if (! playerRemoved) {
          io.emit('game message', {name: 'Game Message' , message: 'No AI Players to remove.'})
        }
    })

    client.on('game start', function(data){
        game.start()
    });

    client.on('message', function(data){
        messages.push(data)
        io.emit('new message', data)
    });
});

module.exports = app;
