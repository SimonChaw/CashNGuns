const Player = require('./player.js')

class AI_Player extends Player {

   constructor (name) {
     super()
     // AI's difficulty used to determine if the AI will pick the best option
     this.difficulty = 3
     // Set flag so the game knows it's an AI player
     this.human = false
     this.name = name
   }

   /*
     Choose Bullet

     Params:
   */
   choose_bullet () {
     // For now this player will just pick a random card
     if (this.bullets > 0 && this.blanks > 0) {
       let choice = Math.floor((Math.random() * 2) + 1)
       return choice == 1 ? 'bullet' : 'blank'
     } else if (this.blanks > 0) {
       return 'blank'
     } else {
       return 'bullet'
     }
   }

   /*
     Pick Target

     Params:
     players - (Array) List of players in the game and all of their properties
   */
   pick_target (players, redirect = false) {
     let wealthy_list = []
     let wounded_list = []
     // Look through the players in this game,
     players.forEach((player) => {
       if (player.index !== this.index) {
         if (redirect && player.isGodFather) {

         } else {
           wealthy_list.push(player)
           wounded_list.push(player)
         }

       }
     })
     wealthy_list.sort(dynamic_sort('cash_value'))
     wounded_list.sort(dynamic_sort('wounds'))
     // Give players a score based on their rank in each list, to see they are a valuable target
     wealthy_list = this.calculate_score(wealthy_list)
     wounded_list = this.calculate_score(wounded_list, true)
     let combined_list = this.combine_arrays(wealthy_list, wounded_list, 'index', 'score')
     // Implement difficulty level at another time
     let rand
     if (combined_list.length > 1) {
       rand = Math.floor((Math.random() * (combined_list.length - 1)) + 1)
     } else {
       rand = 0
     }
     return combined_list[rand].index
   }

   /*
     Banzai or Cower

     Params:
     players - (Array) List of players to look and see who is targeting this player
     currentLoot - (Array) List of current loot cards to decide what the AI will go for

     Look at this players current loot and the loot that is available to see
   */
   banzai_or_cower (players, currentLoot, rounds) {
     let enemies  = 0
     players.forEach((player) => {
       if (player.currentTarget === this.index) {
         enemies = enemies + 1;
       }
     })
     let lootInfo = this.assess_loot(currentLoot)
     // Based on intellegence decide if this is safe for the AI
     if (enemies >= (3 - this.wounds + 3 - this.difficulty)) {
       // There's a good chance we could die. Let's bounce
       return false
     } else {
       // It's probably safe enough for us to keep going
       // But is it worth it to stay in?
       return lootInfo.value / 5000 > enemies + 5 - (this.difficulty * -1) // this formula needs tweaking. Behavior is not as desired.
     }
   }

   /*
     Pick Loot

     Params:
     players - (Array)
     currentLoot - (Array)

     Look at the available loot and pick the best option
   */
   pick_loot (players, currentLoot, rounds) {
     let bestCardIndex = undefined;
     currentLoot.forEach((card, index) => {
       // If rounds === 1 and the AI player is smart enough don't
       // pick any non loot cards (firstaid or extra clip) as they will serve no purpose
       if (rounds === 1 && this.difficulty > 1) {
         if (card.type !== 'firstaid' && card.type !== 'clip' && currentLoot.length > 1) {
           let bestCard = this.best_card(bestCardIndex, card, currentLoot)
           bestCardIndex = bestCard === card ? index : bestCardIndex
         } else if (currentLoot.length === 1) {
           bestCardIndex = index
         }
       } else {
         let bestCard = this.best_card(bestCardIndex, card, currentLoot)
         bestCardIndex = bestCard === card ? index : bestCardIndex
       }
     })
     return bestCardIndex
   }

   /*
     Calculate Score

     Params:
   */
   calculate_score (list, wounded = false) {
     list.forEach((player, index) => {
       if (player.score === undefined) {
         player.score = 0
       }
       if (this.shootToKill && wounded) {
         player.score = (7 - index + 2)
       } else {
         player.score = (7 - index)
       }
     })
     return list
   }

   /*
     Get Current Function

     Params:
     game - Object passed by game to examine things like state and players
   */
   get_current_function (game) {
      let response
      let currentFunction = game.stages[game.currentStage]
      switch (currentFunction) {
       case 'Choice of Bullet Card':
         response = this.choose_bullet()
         break;
       case 'Hold Up':
         response = this.pick_target(game.players)
         break;
       case "God Father Privilege":
         if (this.isGodFather) {
           response = this.pick_target(game.godFatherRisks)
         }
         break;
       case 'Courage':
         response = this.banzai_or_cower(game.players, game.currentLoot, game.rounds)
         break;
       case 'Loot Sharing':
         response = this.pick_loot(game.players, game.currentLoot, game.rounds)
         break;
       default:

      }

      return response
   }

   /*
    Combine scores

    Params:
    array1 - (Array) First array
    array2 - (Array) Second array
    joiner - (String) The name of the property that will combine the arrays
    combiner - (String) The name of the property that will be merged

   */
   combine_arrays (array1, array2, joiner, combiner) {
      array1.forEach((obj1) => {
        //Cycle through second array
        array2.forEach((obj2) => {
          if (obj1[joiner] === obj2[joiner]) {
            obj1[combiner] = obj1[combiner] + obj2[combiner]
          }
        })
      })
      // Now sort by highest combiner
      array1.sort(dynamic_sort('score'))
      return array1
   }

   assess_loot (currentLoot) {
     let lootInfo = {
       'value' : 0,
       'diamond' : 0,
       'clip' : 0,
       'firstaid' : 0,
       'painting' : 0
     }
     currentLoot.forEach((card) => {
       if (card.type === 'cash') {
         lootInfo.value += card.value
       } else {
         lootInfo[card.type] += 1
         lootInfo.value += card.value
       }
     })
     lootInfo.value += this.get_painting_value(lootInfo.painting)
     return lootInfo
   }

   best_card (bestCardIndex, card, currentLoot) {
     if (bestCardIndex === undefined) {
       return card
     }
     let bestCard = currentLoot[bestCardIndex]
     if (card.type !== 'cash') {
       let cpot = this.get_potential_value(card)
       if (bestCard.type !== 'cash') {
         let bpot = this.get_potential_value(bestCard)
         bestCard = cpot > bpot ? card : bestCard
       } else {
         bestCard = cpot > bestCard.value ? card : bestCard
       }
     } else {
       if (bestCard.type !== 'cash') {
         let bpot = this.get_potential_value(bestCard)
         bestCard = card.value > bpot ? card : bestCard
       } else {
         bestCard = card.value > bestCard.value ? card : bestCard
       }
     }
     return bestCard
   }

   get_potential_value (card) {
     let potentialValue = 0
     switch (card.type) {
      case 'painting':
        let count = 1
        this.cards.forEach((card) => {
          count = card.type === 'painting' ? count + 1 : count
        })
        potentialValue = this.get_painting_value(count)
        break;
      case 'firstaid':
        if (this.wounds === 2) {
          // What good is money to a dead man?
          potentialValue = 100000
        } else if (this.wounds === 1) {
          potentialValue = 20000
        }
        break;
      case 'clip':
        if (this.bullets < 1) {
          potentialValue = 10000 * this.difficulty
        } else if (this.bullets > 1) {
          potentialValue = 4000 * this.difficulty
        }
        break;
      case 'diamond':
        // Write function for diamond.
        // Count all the players diamonds and see if taking this diamond
        // will put you in the lead. For now, return actual value
        potentialValue = card.value
        break;
      default:

      return potentialValue
     }
   }

   /*
     Give back the cash value based on the number of paintings collected
   */
   get_painting_value (numPaintings) {
     let values = [0, 4000, 12000, 30000, 60000, 100000, 150000, 200000, 300000, 400000, 500000]
     let value = values[numPaintings]
     return value
   }

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


module.exports = AI_Player
