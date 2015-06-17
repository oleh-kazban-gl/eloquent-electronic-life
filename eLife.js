/*
 Simple simulator of artificial life
 */

var plan = [
  "############################",
  "#      #    #      o      ##",
  "#                          #",
  "#          #####           #",
  "##         #   #    ##     #",
  "###           ##     #     #",
  "#           ###      #     #",
  "#   ####                   #",
  "#   ##       o             #",
  "# o  #         o       ### #",
  "#    #                     #",
  "############################"
];

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function (vector) {
  return new Vector(this.x + vector.x, this.y + vector.y);
};

var directions = {
  'n': new Vector(0, 1),
  's': new Vector(0, -1),
  'w': new Vector(-1, 0),
  'e': new Vector(1, 0),
  'ne': new Vector(1, 1),
  'nw': new Vector(-1, 1),
  'se': new Vector(1, -1),
  'sw': new Vector(-1, -1)
};

var directionNames = "n ne e se s sw w nw".split(" ");

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.space = new Array(width * height);
}

Grid.prototype.isInside = function (vector) {
  return vector.x >= 0 && vector.x < this.width &&
    vector.y >= 0 && vector.y < this.width;
};

Grid.prototype.get = function (vector) {
  return this.space[vector.x + vector.y * this.width];
};

Grid.prototype.set = function (vector, value) {
  this.space[vector.x + vector.y * this.width] = value
};

Grid.prototype.forEach = function (f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value !== null) {
        f.call(context, value, new Vector(x, y));
      }
    }
  }
};

function BouncingCritter() {
  this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) != ' ') {
    this.direction = view.find(' ') || 's';
  }
  return {
    type: 'move',
    direction: this.direction
  };
};

function elementFromChar(legend, ch) {
  if (ch === ' ') {
    return null;
  }
  var element = legend[ch];
  element.originChar = ch;

  return element;
}

function charFromElement(element) {
  if (element === null) {
    return ' ';
  } else {
    return element.originChar;
  }
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    }
  });
}

World.prototype.turn = function () {
  var acted = [];

  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) === -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));

  if (action && action.type === 'move') {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) === null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest)) {
    }
    return dest;
  }
};

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

function View(world, vector) {
  this.world = world;
  this.vector = vector;
}

View.prototype.look = function (dir) {
  var target = this.vector.plus(directions[dir]);

  if (this.world.grid.isInside(target)) {
    return charFromElement(this.world.grid.get(target))
  } else {
    return '#';
  }
};

View.prototype.find = function (ch) {
  var found = this.findAll(ch);

  if (found.length === 0) {
    return null;
  } else {
    return randomElement(found);
  }
};

View.prototype.findAll = function (ch) {
  var found = [];

  for (var dir in directions) {
    if (this.look(dir) === ch) {
      found.push(dir);
    }
    return found;
  }
};

function Wall() {

}

var grid = new Grid(5, 5);

var world = new World(plan, {
  '#': Wall,
  'o': BouncingCritter
});

//console.log(world.toString());

//console.log(grid);
//console.log(grid.get(new Vector(1, 1)));
//console.log(grid.set(new Vector(1, 1), 'X'));
//console.log(grid.get(new Vector(1, 1)));
//
//console.log(plan);

for (var count = 0; count < 5; count++) {
  world.turn();
  console.log(world.toString());
}