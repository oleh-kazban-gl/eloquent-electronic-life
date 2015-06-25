//World

(function (module) {

  function World(map, legend) {
    var grid = new module.Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function (line, y) {
      for (var x = 0; x < line.length; x++)
        grid.set(new module.Vector(x, y),
          elementFromChar(legend, line[x]));
    });
  }

  World.prototype.toString = function () {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
      for (var x = 0; x < this.grid.width; x++) {
        var element = this.grid.get(new module.Vector(x, y));
        output += charFromElement(element);
      }
      output += "\n";
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
  };

  World.prototype.letAct = function (critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == "move") {
      var dest = this.checkDestination(action, vector);
      if (dest && this.grid.set(dest) == null) {
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
      }
      ;
    }
    ;
  };

  World.prototype.checkDestination = function (action, vector) {
    if (module.directions.hasOwnProperty(action.direction)) {
      var dest = vector.plus(module.directions[action.direction]);
      if (this.grid.isInside(dest))
        return dest;
    }
  };

//Lifelike World
  function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
  }

  LifelikeWorld.prototype = Object.create(World.prototype);

  LifelikeWorld.prototype.letAct = function (critter, vector) {
    var action = critter.act(new module.View(this, vector));
    var handled = action &&
      action.type in module.Actions &&
      module.Actions[action.type].call(this, critter, vector, action);

    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  };

  module.World = World;
  module.LifelikeWorld = LifelikeWorld;

})(eLife);