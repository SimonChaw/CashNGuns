"user strict";
let me;

class Game {

    constructor () {
      this.players  = []
      this.stages   = []
      this.cards    = []
      this.rounds   = 0
      this.stages   = ["Choice of Bullet Card", "Hold Up", "God Father Privilege", "Courage", "Loot Sharing"]
      this.currentLoot = []
      this.currentFunction = undefined
      this.currentStage = -1
      this.godFatherIndex = 0
      this.godFatherDeskTaken = false
      this.godFatherRisks = []
    }

    join (player) {
      // Make sure that room isn't at Max
      if (this.players.length < 8) {
        this.players.push(player)
        console.log("Player joined.")
      }
    }

    setup () {
      console.log('Game starting...')
      console.log('Generating Game Cards')
      this.generate_cards()
      console.log('Cards generated and shuffled.');
      this.rounds = 9
    }

    start () {
      // Randomly assign God Father
      this.godFatherIndex = Math.floor(Math.random() * this.players.length)
      let godfather = this.players[this.godFatherIndex];
      godfather.isGodFather = true
      this.players.rotate(this.godFatherIndex)
      this.godFatherIndex = 0 // God father is now first in array
      this.assign_indexes()
      console.log(this.players[0].name +  " you are the god father")
      this.begin_round()
    }

    begin_round () {
      // Did the godfather change? If so, adjust player order
      if (! this.players[0].isGodFather) {
        this.players.rotate(this.godFatherIndex)// Rotate playing order
        this.assign_indexes()
        this.godFatherIndex = 0
        console.log(this.players[0].name + ' is now the godfather!')
      }
      this.rounds = this.rounds - 1
      if (this.rounds === 0) {
        console.log('Game Over, calculating winner...');
        this.calculate_game_winner()
      } else {
        if (this.rounds < 8) {
          console.log('It\'s a new round!');
        }
        this.godFatherDeskTaken = false
        this.loot()
      }

    }

    generate_cards () {
      //create cards
      for(var i = 0; i < 15; i ++){
        //create bills
        var card = new LootCard("cash", 5000)
        this.cards.push(card)
      }
      for(var i = 0; i < 15; i ++){
        //create bills
        var card = new LootCard("cash", 10000)
        this.cards.push(card)
      }
      for(var i = 0; i < 10; i ++){
        //create bills
        var card = new LootCard("cash", 20000)
        this.cards.push(card)
      }
      for(var i = 0; i < 9; i ++){
        //create diamonds
        if(i < 5){
          var card = new LootCard("diamond", 1000)
        } else if(i > 5 && i < 8) {
          var card = new LootCard("diamond", 5000)
        } else {
          var card = new LootCard("diamond", 10000)
        }
        this.cards.push(card)
      }
      for(var i = 0; i < 10; i ++){
        //create paintings
        var card = new LootCard("painting", 0)
        this.cards.push(card)
      }
      for(var i = 0; i < 3; i ++){
        //create clips
        var card = new LootCard("clip", 0);
        this.cards.push(card)
      }
      for(var i = 0; i < 2; i ++){
        //create firstaid
        var card = new LootCard("firstaid", 0);
        this.cards.push(card)
      }
      this.cards = shuffle(this.cards)
    }

    /*
      Loot Function:

      Pulls 8 cards out of the game card pile (based on which round it is) and
      returns them as a bundle to all clients.
    */
    loot () {
      this.currentLoot = []
      for(var i = 0; i < 8; i ++){
        this.currentLoot.push(this.cards[0])
        this.cards.shift()
      }
      console.log(this.currentLoot)
      this.next_stage()
    }

    /*
      Choice of Bullet Card Function:

      Params:
      player - (Object) Copy of the player object taking the action
      choice - (String) Can either be "bullet" or "blank"

      For choosing the bullet card for the hold up phase
    */
    choose_bullet(player, choice) {
      if (this.stages[this.currentStage] === "Choice of Bullet Card" && ! player.actionTaken) {
        switch (choice) {
          case 'bullet':
            if (player.bullets > 0) {
              player.bullets = player.bullets - 1
              player.shootToKill = true
              player.actionTaken = true
              console.log("Bullet loaded");
              this.check_if_finished()
              return true
            } else {
              console.log('You are out of bullets');
              return false
            }
            break;
          case 'blank':
            if (player.blanks > 0) {
              player.blanks = player.blanks - 1
              player.shootToKill = false
              player.actionTaken = true
              console.log("Blank loaded");
              this.check_if_finished()
              return true
            } else {
              console.log('You are out of blanks');
              return false
            }
            break;
          default:
            break;
        }
      }
    }

    /*
      Hold Up Function:

      Params:
      player - (Object) Copy of the player object taking the action
      choice - (Int) Index of the target player

      For choosing the player target who you will shoot at
    */
    hold_up (player, choice, redirect = false) {
      if (this.stages[this.currentStage] === "Hold Up" || redirect === true) {
        choice = parseInt(choice)
        if (choice < this.players.length) {
          if (! this.players[choice].isAlive) {
            return false
          }
          if ((redirect && !this.players[choice].isGodFather) || !redirect) {
            player.currentTarget = choice
            player.actionTaken = true
            if (redirect) {
              console.log(player.name + ' selected a new target ');
              this.next_stage()
            } else {
              console.log(player.name + ' selected a target');
              this.check_if_finished()
            }
            return true
          } else {
            return false
          }
      }
    }
  }

    /*
      Hold Up Function:

      Params:
      player - (Object) Copy of the player object taking the action
      choice - (Int) Index of the target player

      Allows the godfather to redirect one person targeting them
    */
    godfather_privilege (player, choice) {
      if (this.stages[this.currentStage] === "God Father Privilege") {
        // Check if it is the players turn
        if (! player.isGodFather || player.privilegeUsed) {
          return false
        } else {
          this.players[choice].currentTarget = undefined
          player.privilegeUsed = true
          console.log(this.players[choice].name + " please choose another target")
          if (! this.players[choice].human) {
            let ai_choice =  this.players[choice].pick_target(this.players, true)
            console.log(ai_choice)
            this.hold_up(this.players[choice], ai_choice, true)
          }
          return true
        }
      }
    }

    /*
      Courage Function:

      Params:
      player - (Object) Copy of the player object taking the action
      banzai - (Boolean)

      The player can either choose to coward out or stay in for the shoot out
    */
    courage (player, banzai) {
      if (this.stages[this.currentStage] === "Courage") {
        player.banzai = banzai
        player.canPick = banzai
        player.actionTaken = true
        console.log(player.name + ' chose to banzai: ' + banzai);
        this.check_if_finished()
      }
    }

    /*
      Card Effects Function:

      Runs through each player, their targets and their bullet cards and
      calculates damage on each player as well as evaluates if players are still
      alive
    */
    card_effects () {
      // Count to make sure that everyone didn't bail out
      let outCount = 0
      this.players.forEach((player, index) => {
        if (this.players[player.currentTarget].banzai && player.banzai) {
          if (player.shootToKill) {
            // The target player has been shot
            console.log(player.name +  " shot and injured " + this.players[player.currentTarget].name);
            this.players[player.currentTarget].wounds = this.players[player.currentTarget].wounds + 1
            this.players[player.currentTarget].canPick = false
            outCount += 1
            if (this.players[player.currentTarget].wounds > 2) {
              this.players[player.currentTarget].die()
              // Check if one player remains
              remaining = this.check_remaining()
              if (remaining === 1) {
                console.log('Game over. One player Left');
              } else if (remaining === 0) {
                console.log('Wow. Everyone died.');
              }
            }
          } else {
            // The target player has been shot at with a blank!
            console.log(player.name + " shot " + this.players[player.currentTarget].name + "! Oh, it was just a blank");
          }
        } else if (!this.players[player.currentTarget].banzai && player.banzai) {
          // The player cowarded out
          console.log(player.name + " shot at " + this.players[player.currentTarget].name + "! But he ran and hid!");
          this.players[player.currentTarget].canPick = false
        } else if (! player.banzai) {
          outCount += 1
        }
      })
      // Let next_stage know if we even need to continue.
      return outCount < this.players.length
    }

    /*
      Pick Loot Function:

      Params:
      player - (Object) a copy of the player taking the action
      index - (Int) Index of the card being taken

      For picking a card during the loot sharing phase. -1 in index means the
      player is taking the godfather desk and will become the godfather
    */
    pick_loot (player, index) {
      if (this.stages[this.currentStage] === "Loot Sharing" && player.canPick) {
        // Check if it is the players turn
        if (this.is_turn(player)) {
          if (index < this.currentLoot.length && index != -1) {
            player.cards.push(this.currentLoot[index])
            console.log(player.name + ' took this card: ');
            console.log(this.currentLoot[index]);
            this.currentLoot.splice(index, 1)
            player.picked = true
          } else if (index === -1 && ! this.godFatherDeskTaken) {
            // Reassign God Father Index
            player.picked = true
            this.players[this.godFatherIndex].isGodFather = false
            player.isGodFather = true
            this.godFatherIndex = player.index
            this.godFatherDeskTaken = true
            // Assign new god father upon moving to next round.
          } else {
            console.log('This card has already been taken')
          }
          this.check_pick_reset()
          if (this.currentLoot.length === 0) {
            this.next_stage()
          } else {
            this.whos_turn()
          }
        }
      }

    }

    // Non Game Stage Functions

    is_turn (player) {
      let is_turn = false;
      this.players.forEach((tPlayer) => {
        if (!tPlayer.picked) {
          if (tPlayer.index === player.index) {
            is_turn = true
          }
        }
      })
      return is_turn
    }

    // Prompt player to take turn or run AI decision
    whos_turn () {
      for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i]
        if (! player.picked && player.canPick) {
          // Prompt human player, or trigger AI
          if (! player.human) {
            this.pick_loot(player, player.get_current_function(this))
          }
          i = this.players.length
        }
      }
    }

    check_pick_reset () {
      let needs_reset = true
      this.players.forEach((player, index) => {
        if (!player.picked && player.canPick) {
          needs_reset = false
        }
      })
      if (needs_reset) {
        this.players.forEach((player, index) => {
          if (player.canPick) {
            player.picked = false
          }
        })
      }
    }

    next_stage () {
      this.currentStage += 1
      if (this.currentStage !== this.stages.length) {
        this.clean_vars()
        switch (this.stages[this.currentStage]) {
          case "Choice of Bullet Card":
            console.log("Please enter your bullet card choice ('bullet' or 'blank'):")
            this.currentFunction = this.choose_bullet
            break;
          case "Hold Up":
            /*console.log("Input the index of your target:")
            this.players.forEach((player, index) => {
              //console.log("Index: " + index)
              //console.log(player)
            })
            */
            this.currentFunction = this.hold_up
            break;
          case "God Father Privilege":
            let godfatherTargeted = false
            this.godFatherRisks = []
            this.players.forEach((player) => {
              if (player.currentTarget === this.godFatherIndex) {
                godfatherTargeted = true
                this.godFatherRisks.push(player)
              }
            })
            if (! godfatherTargeted) {
              console.log('Godfather is not being targeted this round.')
              this.next_stage()
            } else {
              this.currentFunction = this.godfather_privilege
              console.log("Godfather, you are being targeted, you may tell one of the following players to aim elsewhere:")
              console.log(this.godFatherRisks);
            }
            break;
          case "Courage":
            this.currentFunction = this.courage
            break;
          case "Loot Sharing":
            let allOut = this.card_effects()
            if (allOut) {
              this.currentFunction = this.pick_loot
              this.whos_turn()
            } else {
              this.next_stage()
            }
            break;
          default:

        }
        // Look after each AI Player and get their choices
        this.players.forEach((player) => {
          if (! player.human && this.stages[this.currentStage] !== 'Loot Sharing' && this.currentStage !== -1) {
            console.log(this.stages[this.currentStage]);
            this.currentFunction(player, player.get_current_function(this))
          }
        })

      } else {
        this.clean_vars()
        this.update_score()
        this.currentStage = -1
        this.begin_round()
      }
    }

    /*
      Clean Vars:

      Function for resetting variables between stages
    */
    clean_vars () {
      this.players.forEach((player) => {
        player.actionTaken = false
        player.picked = false
        player.privilegeUsed = false
      })
    }

    /*
      Check if all players have taken the required actions,
      then call next function
    */
    check_if_finished () {
      let finished = true
      this.players.forEach((player) => {
        if (! player.actionTaken) {
          finished = false
        }
      })
      if (finished) {
        this.next_stage()
      }
    }

    /*
      Reassign the indexes of players based on their array position
    */
    assign_indexes () {
      this.players.forEach((player, index) => {
        player.index = index
      })
    }

    /*
      Calculate Game Winner Function:

      Look at the player's score and award special points, then decide winner
    */
    calculate_game_winner () {
      // Find out who has the most Diamonds.

      this.players.sort(dynamic_sort('numDiamonds'))
      if (this.players[0].numDiamonds !== this.players[1].numDiamonds) {
        // Only award the giant diamond if there is no tie for most diamonds
        // Award 60,000 bonus
        this.players[0].currentCash += 60000
      }
      // Now see who has the most money
      this.players.sort(dynamic_sort('currentCash'))
      console.log('Congrats to our game winner ' + this.players[0].name + '!');

      //DEBUGGING
      console.log('Winner:');
      console.log(this.players[0]);
      console.log('All Players');
      console.log(this.players);
    }

    /*
      Update Score Function:

      Itterate through each player and call calculate cash function for them
    */
    update_score () {
      this.players.forEach( player => { this.calculate_cash(player) })
    }

    /*
      Calculate Cash Function:

      Params:
      player - (Object) player who's score is being calculated

    */
    calculate_cash (player) {
      let cash_value = 0;
      let numPaintings = 0;
      let numDiamonds = 0
      player.cards.forEach((card) => {
        if (card.type === "diamond") {
          numDiamonds = numDiamonds + 1
        }
        if (card.type === "painting") {
          numPaintings = numPaintings + 1
        }
        cash_value += card.value;
      })
      player.numDiamonds = numDiamonds
      cash_value += this.get_painting_value(numPaintings)
      player.currentCash = cash_value
      return cash_value
    }

    /*
      Give back the cash value based on the number of paintings collected
    */
    get_painting_value (numPaintings) {
      let values = [0, 4000, 12000, 30000, 60000, 100000, 150000, 200000, 300000, 400000, 500000]
      let value = values[numPaintings]
      return value
    }

    check_remaining () {
      let remaining = 0
      this.players.forEach((player) => {
        if (player.isAlive) {
          remaining = remaning + 1
        }
      })
      return remaining
    }

    /*
      Prepare Game Manifest

      Params:
      reqPlayer - (Object) Player who this package will be sent to

      Deliver relevant game variables but scrub out the data that the client
      shouldn't see like cash value and bullet/bang cards
    */
    prepare_game_manifest(reqPlayer){
       
    }

}

// Card class

class LootCard {

  constructor(type, value) {
    this.type   = type
    this.value  = value
  }

}

//FUNCTIONS
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0])
}

Array.prototype.rotate = function( n ) { //Rotate the array to adjust for the first player
  this.unshift.apply( this, this.splice( n, this.length ) )
  return this;
}

function dynamic_sort (property) {
  return function compare (a,b) {
    if (a[property] > b[property])
      return -1;
    if (a[property] < b[property])
      return 1;
    return 0;
  }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

function make_copy(obj){
    return Object.assign({}, obj);
}

module.exports = Game
