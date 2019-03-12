let me;
class GameContainer {

   constructor(socket, messageHandler, refresh){
     me = this;
     this.currentSceneCounter = 0;
     this.id = undefined;
     this.player = undefined;
     this.socket = socket
     this.handler = messageHandler
     this.refresh = refresh;
     this.rounds = 0
     this.currentLoot = []
     this.players = []
     this.flashMessages = [];
     this.shootOutManifest = [];
     this.gameState = 'pre'
     this.stages = ["Choice of Bullet Card", "Hold Up", "God Father Privilege", "Courage", "Loot Sharing"]
     this.currentStage = -1
     //Set up socket eventHandlers
     // Loot Function
     //this.socket.on('loot', this.loot);
     this.socket.on('game message', me.handleFeedback);
     this.socket.on('player id', function(id){ me.id = id });
     this.socket.on('player manifest', this.acceptPlayerManifest);
     this.socket.on('shoot out manifest', this.acceptShootOutManifest);
     this.socket.on('setup round', this.setupRound);
     this.socket.on('sync game', this.acceptGameManifest);
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
     console.log(choice);
     me.socket.emit('player input', choice)
   }

   handleFeedback(message){
     me.handler(message)
   }

   sendAction(action){
     this.socket.emit(action);
   }

   acceptPlayerManifest(data){
     me.players = data;
     for (var i = 0; i < me.players.length; i++) {
       if (me.players[i].id === me.id) {
         me.player = me.players[i]
         i = me.players.length
       }
     }
     me.refresh();
   }

   acceptGameManifest(data){
     console.log(data);
     me.acceptPlayerManifest(data.players);
     me.currentStage = data.currentStage;
     me.refresh();
   }

   acceptShootOutManifest(data){
     console.log(data);
     me.shootOutManifest = data;
     me.refresh();
   }

   setupRound(game){
     me.currentStage = game.currentStage;
     me.currentLoot = game.currentLoot;
     me.acceptPlayerManifest(game.players);
     me.refresh();
   }

   nextScene(){
     if (me.shootOutManifest.length > 0) {
       console.log('hit');
       me.shootOutManifest.shift();
       me.refresh();
     }
   }

   getShootOutAnim(shooter){
     if (shooter) {

     } else {
       if (this.shootOutManifest[0].bullet && this.shootOutManifest[0].hit) {
         return 'hurt'
       } else if (! this.shootOutManifest[0].bullet && this.shootOutManifest[0].hit) {
         return 'idle'
       } else {
         return 'runaway'
       }
     }
   }


}

export default GameContainer;
