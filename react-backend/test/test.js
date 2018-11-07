const fs = require('fs')
const vm = require('vm')
const chai = require('chai')
const things = require('chai-things')

const Player = require('../player.js')
const AI_Player = require('../ai_player.js')

chai.use(things)

const expect = chai.expect

describe('Game Logic Testing Script', () => {


  let p1 = new Player('Tim')
  let p2 = new Player('Geo')
  let code
  before('load script.js', (done) => {
    fs.readFile('game.js', (err, data) => {
      if (err) {
        throw err
      }
      code = data
      vm.runInThisContext(code)

      done()
    })
  })

  describe('Game class', () => {
      let game

      it('should exist and be a class', () => {
        expect(Game).to.exist
        expect(Game).to.be.an.instanceof(Object)
      })

      before('create instance of Game class', () => {
        game = new Game()
      })

      describe('setup function', () => {
        it('should exist and be a function', () => {
          expect(game.setup).to.exist
          expect(game.setup).to.be.an.instanceof(Function)
        })
      })

      describe('join function', () => {

        it('should exist and be a function', () => {
          expect(game.join).to.exist
          expect(game.join).to.be.an.instanceof(Function)
        })

      })

      describe('loot function', () => {
        it('should exist and be a function', () => {
          expect(game.loot).to.exist
          expect(game.loot).to.be.an.instanceof(Function)
        })
      })
      /*
      describe('', () => {
        it('should exist and be a function', () => {
          expect(game.).to.exist
          expect(game.).to.be.an.instanceof(Function)
        })
      })
      */
      /*
      describe('Test Full Begining Round', () => {
        before('Start New Game', () => {
          game = new Game()
          game.join(p1)
          game.join(p2)
          game.setup()
        })

        it('should create a deck of 64 cards', () => {
          expect(game.cards.length).to.equal(64)
        })

        it('two players should exist', () => {
          expect(game.players.length).to.equal(2)
        })

        it('should start game and have 8 current loot cards', () => {
          game.start()
          expect(game.currentLoot.length).to.equal(8)
        })

        it('should move from bullet choice phase after valid choice provided', () => {
          expect(game.currentStage).to.equal(0)
          game.currentFunction(game.players[0], 'blank')
          game.currentFunction(game.players[1], 'blank')
          expect(game.currentStage).to.equal(1)
        })

        it('should move from hold up phase after valid choices', () => {
          expect(game.currentStage).to.equal(1)
          game.currentFunction(game.players[0], 1)
          game.currentFunction(game.players[1], 0)
          expect(game.currentStage).to.equal(2)
        })

        it('should allow the godfather to redirect an enemy', () => {
          let redirecter = game.godFatherIndex === 1 ? 0 : 1
          game.currentFunction(game.players[game.godFatherIndex], redirecter)
        })

        it('should allow a player to redirect after request from God Father', () => {
          let redirecter = game.godFatherIndex === 1 ? 0 : 1
          game.hold_up(game.players[redirecter], redirecter, true)
          expect(game.currentStage).to.equal(3)
        })

        it('should allow the player to banzai or coward', () => {
          // Player 1 will cower & Player 2 will bonzai
          game.currentFunction(game.players[0], true)
          game.currentFunction(game.players[1], true)
          expect(game.currentStage).to.equal(4)
        })

        it('should allow the players to pick loot until there are no cards left', () => {
          let i = 0
          while (game.currentLoot.length > 0) {
            game.currentFunction(game.players[0], 0)
            if (i === 3) {
              game.currentFunction(game.players[1], -1)
            } else {
              game.currentFunction(game.players[1], 0)
            }
            i ++
          }
          expect(game.players[1].cards.length).to.equal(5)
          expect(game.players[0].cards.length).to.equal(3)
          expect(game.players[0].isGodFather).to.equal(true)
        })

      })
      */

    describe('AI Testing', () => {

      let Tim, Tom, Tref, Starf, Narf;

      before('Setup AI Players', () => {
        game  = new Game()
        Tim   = new AI_Player('Tim')
        Tom   = new AI_Player('Tom')
        Tref  = new AI_Player('Tref')
        Starf = new AI_Player('Starf')
        Narf  = new AI_Player('Narf')
        game.join(Tim)
        game.join(Tom)
        game.join(Tref)
        game.join(Starf)
        game.join(Narf)
        game.setup()
      })

      it('should create a deck of 64 cards', () => {
        game.start()
      })





    })
  })



})
