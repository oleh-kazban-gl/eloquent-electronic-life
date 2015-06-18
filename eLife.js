'use strict';

var plan = [
  '############################',
  '#      #    #      o      ##',
  '#                          #',
  '#          #####           #',
  '##         #   #    ##     #',
  '###           ##     #     #',
  '#           ###      #     #',
  '#   ####                   #',
  '#   ##       o             #',
  '# o  #         o       ### #',
  '#    #                     #',
  '############################'
];

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

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

// Original code has some mistakes, that deals with directions

var directions = {
  'n': new Vector(0, 1),
  'ne': new Vector(1, -1),
  'e': new Vector(1, 0),
  'se': new Vector(1, 1),
  's': new Vector(0, -1),
  'sw': new Vector(-1, 1),
  'w': new Vector(-1, 0),
  'nw': new Vector(-1, -1)
};

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
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

var directionNames = 'n ne e se s sw w nw'.split(' ');

function BouncingCritter() {
  this.direction = straightElement(directionNames);
};

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) != ' ')
    this.direction = view.find(' ') || 's';
  return {type: 'move', direction: this.direction};
};

function elementFromChar(legend, ch) {
  if (ch == ' ')
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
        elementFromChar(legend, line[x]));
  });
}

function charFromElement(element) {
  if (element == null)
    return ' ';
  else
    return element.originChar;
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

function Wall() {
}

var world = new World(plan, {
  '#': Wall,
  'o': BouncingCritter
});

Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

World.prototype.turn = function () {
  var acted = [];
  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == 'move') {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};

function View(world, vector) {
  this.world = world;
  this.vector = vector;
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
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};

View.prototype.find = function (ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;

  //return randomElement(found);

  return straightElement(found); // let make movement more straight
};

function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

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

function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}

LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
      vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};

actionTypes.grow = function (critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function (critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
    critter.energy <= 1 ||
    this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};

actionTypes.eat = function (critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.reproduce = function (critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);

  //if (dest == null ||
  //  critter.energy <= 2 * baby.energy ||
  //  this.grid.get(dest) != null)
  //  return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

function Plant() {
  this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function (context) {
  if (this.energy > 15) {
    var space = context.find(' ');
    if (space)
      return {type: 'reproduce', direction: space};
  }
  if (this.energy < 20)
    return {type: 'grow'};
};

function PlantEater() {
  this.energy = 20;
}

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

var valley = new LifelikeWorld(
  [
    '############################',
    '#####                 ######',
    '##   ***                **##',
    '#   *##**         **  O  *##',
    '#    ***     O    ##**    *#',
    '#       O         ##***    #',
    '#                 ##**     #',
    '#   O       #*             #',
    '#*          #**       O    #',
    '#***        ##**    O    **#',
    '##****     ###***       *###',
    '############################'
  ],
  {
    '#': Wall,
    'O': PlantEater,
    '*': Plant
  }
);

function SmartPlantEater() {
  this.energy = 20;
}

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

  if (plant) {
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

//var smartValley = new LifelikeWorld(
//  [
//    "############################",
//    "#####@                ######",
//    "##   ***                **##",
//    "#   *##**         **  O  *##",
//    "#    ***     O    ##**    *#",
//    "#       O         ##***    #",
//    "#                 ##**     #",
//    "#   O       #*             #",
//    "#*          #**       O    #",
//    "#***        ##**    O    **#",
//    "##****    ###***       @*###",
//    "############################"
//  ],
//  {
//    '#': Wall,
//    'O': SmartPlantEater,
//    '@': Predator,
//    '*': Plant
//  }
//);
var smartValley = new LifelikeWorld(
  [
    "####################################################",
    "#                 ####         ****              ###",
    "#   *  @  ##                 ########       OO    ##",
    "#   *    ##        O O                 ****       *#",
    "#       ##*                        ##########     *#",
    "#      ##***  *         ****                     **#",
    "#* **  #  *  ***      #########                  **#",
    "#* **  #      *               #   *              **#",
    "#     ##              #   O   #  ***          ######",
    "#*            @       #       #   *        O  #    #",
    "#*                    #  ######                 ** #",
    "###          ****          ***                  ** #",
    "#       O                        @         O       #",
    "#   *     ##  ##  ##  ##               ###      *  #",
    "#   **         #              *       #####  O     #",
    "##  **  O   O  #  #    ***  ***        ###      ** #",
    "###               #   *****                    ****#",
    "####################################################"
  ],
  {
    '#': Wall,
    'O': SmartPlantEater,
    '@': Predator,
    '*': Plant
  }
);