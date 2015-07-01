(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Actions: here defined all possible actions for entity
 */

var elementFromChar = require('../helperElements/elementFromChar');

var actionTypes = Object.create(null);

actionTypes.grow = function (critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function (critter, vector, action) {
  var destination = this.checkDestination(action, vector);
  if (destination == null ||
    critter.energy <= 1 ||
    this.grid.get(destination) != null)
    return false;

  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(destination, critter);
  return true;
};

actionTypes.eat = function (critter, vector, action) {
  var destination = this.checkDestination(action, vector);
  var atDestination = destination != null && this.grid.get(destination);
  if (!atDestination || atDestination.energy == null)
    return false;
  critter.energy += atDestination.energy;
  this.grid.set(destination, null);
  return true;
};

actionTypes.reproduce = function (critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var destination = this.checkDestination(action, vector);

  if (destination == null ||
    critter.energy <= 2 * baby.energy ||
    this.grid.set(destination) != null)
    return false;

  critter.energy -= 2 * baby.energy;
  this.grid.set(destination, baby);
  return true;
};

module.exports = actionTypes;
},{"../helperElements/elementFromChar":15}],2:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Barrier: barrier definition
 */

//Barrier
function Barrier() {}

//Wall
function Wall() {}

 module.exports = Wall;
},{}],3:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Critter: critter definition
 */

var randomElement = require('../helperElements/randomElement');

function Critter() {
  this.energy = 10;
  this.direction = '';
  this.food = [];
  this.entity = '';
  this.information = {};
}

function SmartPlantEater() {
  this.energy = 30;
  this.hungry;
  this.direction = 's';
  this.food = ['*', 'o'];
  this.entity = 'o';
  this.information = {};
}

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

function Tiger() {
  this.energy = 100;
  this.direction = 's';
  this.food = ['o', '@', '*'];
  this.totalFood = [];
  this.entity = '@';
  this.information = {};
}

Tiger.prototype.act = function (context) {
  var space = context.find(' ');
  var entity = context.find('@');

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

  if (entity && space) {
    if (this.energy > 200) {
      this.information.action = 'reproduce';
      console.log(this.information);

      return {type: 'reproduce', direction: space}
    }else if (this.energy < 50){
      this.information.action = 'run out from other tiger';
      console.log(this.information);

      return {type: 'move', direction: space}
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

module.exports = {
  smartPlantEater: SmartPlantEater,
  tiger: Tiger
}
},{"../helperElements/randomElement":16}],4:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Plant: plant definition
 */

var Plant = function () {
  this.energy = 3 + Math.random() * 4;
  this.entity = '*';
  this.information = {};
};

Plant.prototype.act = function (context) {
  this.information = {
    entity: this.entity,
    energy: this.energy
  };

  if (this.energy > 20) {
    var space = context.find(' ');
    if (space) {
      this.information.action = 'reproduce';
      console.log(this.information);

      return {type: 'reproduce', direction: space};
    }
  }
  if (this.energy < 20) {
    this.information.action = 'grow';
    console.log(this.information);

    return {type: 'grow'};
  }
};

var Grass = function () {
  this.energy = 3 + Math.random * 4;
  this.entity = '*';
  this.information = {};
};

Grass.prototype.act = function (context) {

  this.information = {
    entity: this.entity,
    energy: this.energy
  };

  if (this.energy > 20) {
    var space = context.find(' ');
    if (space) {
      this.information.action = 'reproduce';
      console.log(this.information);

      return {type: 'reproduce', direction: space};
    }
  }

  if (this.energy < 20) {
    this.information.action = 'grow';
    console.log(this.information);

    return {type: 'grow'};
  }
};

module.exports = Plant;
},{}],5:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Grid: world's grid
 */

var Vector = require('./Vector');

function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}

Grid.prototype.isInside = function (vector) {
  return vector.x >= 0 && vector.x < this.width &&
    vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y];
};

Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};

Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

module.exports = Grid;
},{"./Vector":8}],6:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * LifelikeWorld: is used for bringing life to objects
 */

var World = require('./World');
var View = require('./View');
var Actions = require('../Entity/Actions');

function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}

LifelikeWorld.prototype = Object.create(World.prototype);

LifelikeWorld.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in Actions &&
    Actions[action.type].call(this, critter, vector, action);

  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};

module.exports = LifelikeWorld;
},{"../Entity/Actions":1,"./View":9,"./World":10}],7:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Plan: combining of map and description of signs
 */

var Barrier = require('../Entity/Barrier');
var Critter = require('../Entity/Critter');
var Plant = require('../Entity/Plant');
var LifeLikeWorld = require('./LifeLikeWorld');

var map = [
  '########################################################################################################',
  '#                 ####         ****                          *  *  **                ***      o      ###',
  '#   *  @  ##                 ########       oo                                       ****             ##',
  '#   *    ##        o o                 ****                ###               ###     * *   ###        *#',
  '#       ##*                        ##########         @      ##*       ##     ###          ### o      *#',
  '#      ##***  *         ****                                 ##*       ***          @     ##         **#',
  '#* **  #  *  ***      #########                               ###                        ##          **#',
  '#* **  #      *               #   *         ##         @                     o                       **#',
  '#     ##              #   o   #  ***         ###              #                                   ######',
  '#*            @       #       #   *        o  ##             ###      o    ####                   #    #',
  '#*                    #  ######                             ###              ***#####     o         ** #',
  '###          ****          ***                                                                      ** #',
  '#       o                                  o       # ###      **                                       #',
  '#   *     ##  ##  ##  ##               ###         #########  ***        ####        ##             *  #',
  '#   **         #              *       #####  o     *****####             ####****   ###   o            #',
  '##  **  o   o  #  #    ***  ***        ###              ****       o       ######                   ** #',
  '###               #   *****                                                                        ****#',
  '########################################################################################################'
];

var description = {
  '#': Barrier,
  'o': Critter.smartPlantEater,
  '@': Critter.tiger,
  '*': Plant
};

var valley = new LifeLikeWorld(map, description);

module.exports = valley;
},{"../Entity/Barrier":2,"../Entity/Critter":3,"../Entity/Plant":4,"./LifeLikeWorld":6}],8:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Vector: vector of movement
 */

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

module.exports = Vector;

},{}],9:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * View: what entity see right in front
 */

var directions = require('./directions');
var charFromElement = require('../helperElements/charFromElement');
var randomElement = require('../helperElements/randomElement');

function View(World, Vector) {
  this.world = World;
  this.vector = Vector;
}

View.prototype.look = function (dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return '#';
};

View.prototype.findAll = function (ch) {
  var found = [];
  for (var dir in directions) {
    if (this.look(dir) == ch)
      found.push(dir);
  }
  return found;
};

View.prototype.find = function (ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;
  return randomElement(found);
};

module.exports = View;
},{"../helperElements/charFromElement":14,"../helperElements/randomElement":16,"./directions":12}],10:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * World: world mechanics
 */

var Grid = require('./Grid');
var Vector = require('./Vector');
var charFromElement = require('../helperElements/charFromElement');
var elementFromChar = require('../helperElements/elementFromChar');
var View = require('./View');
var directions = require('./directions');

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;
  this.tickCounter = 0;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    }
  });
}

World.prototype.toString = function () {
  var output = '';
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += '\n';
  }
  return output;
};

World.prototype.turn = function () {
  var acted = [];
  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
  this.tickCounter++;
};

World.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == 'move') {
    var destination = this.checkDestination(action, vector);
    if (destination && this.grid.set(destination) == null) {
      this.grid.set(vector, null);
      this.grid.set(destination, critter);
    };
  };
};

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var destination = vector.plus(directions[action.direction]);
    if (this.grid.isInside(destination))
      return destination;
  }
};

module.exports = World;

},{"../helperElements/charFromElement":14,"../helperElements/elementFromChar":15,"./Grid":5,"./Vector":8,"./View":9,"./directions":12}],11:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * This is used for world animation
 */

var world = require('./Plan');
var calcEntities = require('../helperElements/calcElements');

function refreshMap() {
  window.interval = setInterval(function(){
    world.turn();
    document.getElementById('world').innerHTML = world.toString();
    document.getElementById('ticksCounter').innerHTML = 'World ticks since creation: ' + world.tickCounter;
    document.getElementById('worldObjects').innerHTML = '<h3>Entities:</h3>' +
      'Plants: ' + calcEntities().plants + '<br>' +
      'PlantEaters: ' + calcEntities().plantEaters + '<br>' +
      'Tigers: ' + calcEntities().tigers;
  }, 333);
}

module.exports = refreshMap;
},{"../helperElements/calcElements":13,"./Plan":7}],12:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * directions: stores Vectors
 */

var Vector = require('./Vector');

var directions = {
  'n': new Vector(0, -1),
  'ne': new Vector(1, -1),
  'e': new Vector(1, 0),
  'se': new Vector(1, 1),
  's': new Vector(0, 1),
  'sw': new Vector(-1, 1),
  'w': new Vector(-1, 0),
  'nw': new Vector(-1, -1)
};

module.exports = directions;
},{"./Vector":8}],13:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * calcEntities: utility function for parsing of world and retrieving ammount
 * of habitats.
 */

var world = require('../Universe/Plan');

function calcEntities() {
  var entities = world.toString().split('\n');
  var plants = 0;
  var plantEaters = 0;
  var tigers = 0;
  var plantSign = '*';
  var plantEaterSign = 'o';
  var tigerSign = '@';

  for (var count = 0; count < entities.length; count++) {
    var line = entities[count].split('');
    for (var i = 0; i < line.length; i++) {
      if (line[i] === plantSign) {
        plants++;
      }
      if (line[i] === plantEaterSign) {
        plantEaters++;
      }
      if (line[i] === tigerSign) {
        tigers++;
      }
    }
  }

  return {
    plants: plants,
    plantEaters: plantEaters,
    tigers: tigers
  };
}

module.exports = calcEntities;
},{"../Universe/Plan":7}],14:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * charFromElement: utility function to retrieve char from element
 */

function charFromElement(element) {
  if (element == null) {
    return ' ';
  } else {
    return element.originChar;
  }
}

module.exports = charFromElement;
},{}],15:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * elementFromChar: utility function to retrieve element from char
 */

function elementFromChar(legend, ch) {
  if (ch === ' ') {
    return null;
  }

  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

module.exports = elementFromChar;
},{}],16:[function(require,module,exports){
/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * randomElement: utility function to retrieve random element
 */

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = randomElement;
},{}],17:[function(require,module,exports){
var map = require('./app/Universe/Plan');
var start = require('./app/Universe/animateWorld');

start(map);
},{"./app/Universe/Plan":7,"./app/Universe/animateWorld":11}]},{},[17]);
