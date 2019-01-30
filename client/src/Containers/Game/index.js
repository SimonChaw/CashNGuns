let handler;

class GameContainer {

   constructor(socket, messageHandler){
     this.socket = socket
     handler = messageHandler
     this.rounds = 0
     this.currentLoot = []
     this.players = []
     this.gameState = 'pre'
     this.stages = ["choose bullet", "hold up", "godfather privlege", "courage", "pick loot"]
     this.currentStage = -1
     //Set up socket eventHandlers
     // Loot Function
     //this.socket.on('loot', this.loot);
     this.socket.on('game message', this.handleFeedback);
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
     handler(message)
   }

   addAIPlayer(){
     this.socket.emit('add ai player');
   }

   removeAIPlayer(){
     this.socket.emit('remove ai player');
   }



}

export default GameContainer;
