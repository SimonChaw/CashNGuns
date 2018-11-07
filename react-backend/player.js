"use strict";

class Player {

  constructor (name) {
    this.bullets = 3
    this.blanks = 5
    this.wounds = 0
    this.isGodFather = false
    this.cards = []
    this.banzai = undefined
    this.target = undefined
    this.shootToKill = undefined
    this.privilegeUsed = undefined
    this.actionTaken = false
    this.currentTarget = undefined
    this.isAlive = true
    this.picked = false
    this.currentCash = 0
    this.numDiamonds = 0
    this.index = undefined
    this.name = name
    this.human = true
  }

  die () {
    this.isAlive = false
  }

  heal () {
    if (this.isAlive) {
      this.wounds = 0
    }
  }

  add_bullet () {
    if (this.blanks > 0) {
      this.blanks = this.blanks - 1
      this.bullets = this.bullets + 1
    }
  }
}

module.exports = Player
