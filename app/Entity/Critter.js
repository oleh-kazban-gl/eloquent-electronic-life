'use strict';

var Critter = (function () {
  function Critter() {
    //this.energy = 20;
  }

  Critter.prototype.act = function (context) {
    var space = context.find(' ');
    if (space)
      return {type: 'move', direction: space};
  }

  function PlantEater() {
    this.energy = 20;
  }

//PlantEater.prototype = Critter;

  PlantEater.prototype.act = function (context) {
    var space = context.find(' ');
    if (this.energy > 60 && space)
      return {type: 'reproduce', direction: space};
    var plant = context.find('*');
    if (plant)
      return {type: 'eat', direction: plant};
    if (space)
      return {type: 'move', direction: space};
  };

  function WallFollower() {
    this.dir = 's';
  }

  WallFollower.prototype.act = function (view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != ' ')
      start = this.dir = dirPlus(this.dir, -2);
    while (view.look(this.dir) != ' ') {
      this.dir = dirPlus(this.dir, 1);
      if (this.dir == start) break;
    }
    return {type: 'move', direction: this.dir};
  };

  function BouncingCritter() {
    this.direction = straightElement(Grid.directionNames);
  };

  BouncingCritter.prototype.act = function (view) {
    if (view.look(this.direction) != ' ')
      this.direction = view.find(' ') || 's';
    return {type: 'move', direction: this.direction};
  };

  function SmartPlantEater() {
    this.energy = 20;
    this.direction = 's';
  }

  SmartPlantEater.prototype = new Critter();

  SmartPlantEater.prototype.decision = function (probability) {
    if (probability > 0.25) {
      return true;
    } else {
      return false;
    }
  };

  SmartPlantEater.prototype.act = function (context) {

    var space = context.find(' ');
    var hungry = (1 / this.energy) * 10;
    var probability = Math.random() * hungry;
    var plant = context.find('*');
    var predator = context.find('@');

    var otherEntity = context.find('O');

    console.log('O: energy: ' + this.energy +
      ' , hungry: ' + hungry +
      ' , probability: ' + probability +
      ', eat? : ' + this.decision(probability));


    /*
     Let change reproduction method - the "birth" of child will take some energy
     but if energy is more than some level one more little critter will be birth.
     Thus we can make some sign of safely system.

     Also let add sexual reproduction - when critter has enough energy for hot
     night.
     */

    if (context.look(this.direction) != " ") {
      this.direction = context.find(" ") || "s";
    }

    if (space && this.energy > 60) {
      console.log('O: New little critter appears! reproduce, energy: ' + this.energy);
      return {type: 'reproduce', direction: space};
    }

    if (otherEntity) {
      if (this.energy > 20 && space) {
        this.energy += 5; // because of good relax :p
        console.log('O: Time for love!!! ????? energy: ' + this.energy);

        return {type: 'reproduce', direction: space};
      } else if (hungry >= 2) {

        this.energy += 5;
        console.log('O: Omnomnom ? energy: ' + this.energy);

        return {type: 'eat', direction: otherEntity};
      }
    }

    if (predator && space) {
      console.log('O: is running from predator');
      return {type: 'move', direction: space};
    }

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

    if (plant && plant.length > 1) {
      if (hungry >= 1) {
        console.log('O: eat');
        return {type: 'eat', direction: plant};
      } else if (hungry < 1 || this.decision(probability)) {
        console.log('O: eat');
        return {type: 'eat', direction: plant};
      } else {
        console.log('O: move');
        return {type: 'move', direction: space};
      }
    }

    if (space || hungry <= 0.1) {
      console.log('O: move');
      return {type: 'move', direction: space};
    }
  };

  function Predator() {
    this.energy = 200;
  }

  Predator.prototype = new Critter();

  Predator.prototype.act = function (context) {
    var space = context.find(' ');
    var otherEntity = context.find('@');
    var herbivore = context.find('O');
    var plant = context.find('*');

    if (plant && this.energy < 20) {
      console.log('@: Predator is so hungry that it eats the plants!');
      return {type: 'eat', direction: plant};
    }

    if (space && this.energy > 300) {
      console.log('@: New predator appears!');
      return {type: 'reproduce', direction: space};
    }

    if (herbivore) {
      console.log('@: Yami-yami )))');
      return {type: 'eat', direction: herbivore};
    }

    if (otherEntity) {
      if (this.energy > 200 && space && Math.random() > 0.5) {
        console.log('@: It\'s time for love!!! New predator appears!');
        return {type: 'reproduce', direction: space};
      } else if (space) {
        console.log('@: FIGHT!!!');
        this.energy -= 20; // Fight
        return {type: 'move', direction: space};
      }
    }

    if (space) {
      console.log('@: move, energy: ' + this.energy);
      return {type: 'move', direction: space};
    }
  };

  function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
  }

//Let make critter movement more straightforward, not like broun's movement
  function straightElement(array) {
    for (var count = 0; count < array.length; count++) {
      if (array[count] === 's') {
        return 's';
      } else {
        return array[Math.floor(Math.random() * array.length)];
      }
    }
  }

  return {
    predator: Predator,
    plantEater: SmartPlantEater,
    straightElement: straightElement
  }
})();