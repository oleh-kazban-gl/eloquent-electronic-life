//Critter

define([
  '../helperElements/randomElement'
], function (randomElement) {
  'use strict';

  function Critter() {
    this.energy = 10;
    this.direction = '';
    this.food = [];
    this.entity = '';
    this.information = {};
  }

//SmartPlantEater
  function SmartPlantEater() {
    this.energy = 30;
    this.hungry;
    this.direction = 's';
    this.food = ['*', 'o'];
    this.entity = 'o';
    this.information = {};
  }

//SmartPlantEater.prototype = new Critter();
//SmartPlantEater.__proto__ = Critter;

  SmartPlantEater.prototype.act = function (context) {
    var space = context.find(' ');
    var predator = context.find('@');
    var entity = context.find('o');
    var plant = context.find('*');
    this.hungry = (1 / this.energy) * 10;
    this.probability = Math.random() * this.hungry;

    this.information = {
      entity: this.entity,
      energy: this.energy,
      hungry: this.hungry,
      eatProbability: this.probability,
      direction: this.direction
    };

    if (this.energy > 100 && space) {
      this.information.action = 'reproduce';
      console.log(this.information);

      return {type: 'reproduce', direction: space};
    }

    var plants = context.findAll('*');

    /*
     Preventing herbivores greedy behaviour, now they eat only if their energy
     is lower than some value.
     Other solution than energy barrier is to let critter decide - it want to eat
     this plant or not.
     More accurate behaviour will be the mix of energy value (as we can decide that
     energy is inverse hungry value - the big energy means low hungry, the low
     energy means high hungry) and random decision to eat. The value of hungry is
     like probability to eat exact this plant.
     Let describe hungry as some critical value of energy. If energy is lower
     than 10, than our critter is hungry (hungry >= 1 'true'). On the other hand
     if energy is more than 20, hungry is lower than 1 and we can act 50/50 -
     or eat or not to eat.
     */

    //Than bigger hungry than bigger probability to make decision to eat plant

    if (plants.length > 1) {
      if (this.hungry >= 1) {
        this.information.action = 'eat';
        console.log(this.information);

        return {type: 'eat', direction: plant};
      } else if (this.hungry < 1 || this.decision(this.probability)) {
        this.information.action = 'eat';
        console.log(this.information);

        return {type: 'eat', direction: plant};
      }

      this.information.action = 'eat';
      console.log(this.information);

      return {type: 'eat', direction: randomElement(plants)};
    }

    if (context.look(this.direction) != ' ') {
      this.direction = context.find(' ') || 's';
    }

    /*
     Let change reproduction method - the "birth" of child will take some energy
     but if energy is more than some level one more little critter will be birth.
     Thus we can make some sign of safely system.
     Also let add sexual reproduction - when critter has enough energy for hot
     night.
     */

    if (entity) {
      if (this.energy > 100 && space) {
        this.information.action = 'reproduce )))';
        console.log(this.information);

        return {type: 'reproduce', direction: space};
      } else if (this.hungry >= 2) {
        this.information.action = 'eat >8(';
        console.log(this.information);

        return {type: 'eat', direction: entity};
      }
    }

    if (predator && space) {
      this.information.action = 'running from predator';
      return {type: 'move', direction: space};
    }

    this.information.action = 'move';
    console.log(this.information);

    return {type: 'move', direction: this.direction}
  };

  SmartPlantEater.prototype.decision = function (probability) {
    if (probability > 0.25) {
      return true;
    } else {
      return false;
    }
  };

//Tiger
  function Tiger() {
    this.energy = 40;
    this.direction = 's';
    this.food = ['o', '@', '*'];
    this.totalFood = [];
    this.entity = '@';
    this.information = {};
  }

//Tiger.__proto__ = Critter;

  Tiger.prototype.act = function (context) {
    var space = context.find(' ');
    var entity = '@';

    this.information = {
      entity: this.entity,
      energy: this.energy,
      direction: this.direction
    };

    var food = context.findAll('o');
    this.totalFood.push(food.length);

    var foodInTurns = this.totalFood.reduce(function (a, b) {
        return a + b;
      }) / this.totalFood.length;

    if (this.totalFood.length > 6)
      this.totalFood.shift();

    if (this.energy > 200 && space) {
      this.information.action = 'reproduce';
      console.log(this.information);

      return {type: 'reproduce', direction: space}
    }

    if (food.length && foodInTurns > 0.25) {
      this.information.action = 'eat';
      console.log(this.information);

      return {type: 'eat', direction: randomElement(food)}
    }

    if (context.look(this.direction) != ' ') {
      this.direction = space || 's';
    }

    if (entity) {
      if (this.energy > 60 && space) {
        this.information.action = 'reproduce';
        console.log(this.information);

        return {type: 'reproduce', direction: space}
      } else {
        this.information.action = 'fight';
        this.energy -= 5;

        console.log(this.information);

        return {type: 'move', direction: space}
      }
    }

    this.information.action = 'move';
    console.log(this.information);

    return {type: 'move', direction: this.direction};
  };

  return {
    critter: Critter,
    smartPlantEater: SmartPlantEater,
    tiger: Tiger
  }
});