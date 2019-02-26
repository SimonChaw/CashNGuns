let me;
class GameContainer {

   constructor(socket, messageHandler, refresh){
     me = this;
     this.socket = socket
     this.handler = messageHandler
     this.refresh = refresh;
     this.rounds = 0
     this.currentLoot = []
     this.players = []
     this.flashMessages = [];
     this.gameState = 'pre'
     this.stages = ["choose bullet", "hold up", "godfather privlege", "courage", "pick loot"]
     this.currentStage = -1
     //Set up socket eventHandlers
     // Loot Function
     //this.socket.on('loot', this.loot);
     this.socket.on('game message', me.handleFeedback);
     this.socket.on('player manifest', this.acceptPlayerManifest);
     this.socket.on('setup round', this.setupRound);
     this.socket.on('flash message', function(data){ me.flashMessages.push(data.message); me.refresh(); })
     //this.socket.on('')
     this.socket.emit('create game');
     this.socket.emit('join game', { name : 'Simon' });
   }

   loot(cards){
     this.currentLoot = cards;
     this.currentStage = 0
   }

   sendChoice(choice){
     this.socket.send(choice, this.stages[this.currentStage])
   }

   handleFeedback(message){
     me.handler(message)
   }

   sendAction(action){
     this.socket.emit(action);
   }

   acceptPlayerManifest(data){
     me.players = data;
     me.refresh();
   }

   setupRound(game){
     me.currentStage = game.currentStage;
     me.currentLoot = game.currentLoot;
     console.log(game);
     me.refresh();
   }


}

export default GameContainer;
