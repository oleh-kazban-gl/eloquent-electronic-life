'use strict';

var World = (function () {

  function World(map, legend) {
    //var grid = new Grid(map[0].length, map.length);
    var grid = new Grid.Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function (line, y) {
      for (var x = 0; x < line.length; x++) {
        grid.set(new Grid.Vector(x, y),
          elementFromChar(legend, line[x]));
      }
    });
  }

  World.prototype = {
    toString: function () {
      var output = '';
      for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
          var element = this.grid.get(new Grid.Vector(x, y));
          output += charFromElement(element);
        }
        output += '\n';
      }
      return output;
    },
    turn: function () {
      var acted = [];
      this.grid.forEach(function (critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) {
          acted.push(critter);
          this.letAct(critter, vector);
        }
      }, this);
    },
    letAct: function (critter, vector) {
      var action = critter.act(new View(this, vector));
      if (action && action.type == 'move') {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
          this.grid.set(vector, null);
          this.grid.set(dest, critter);
        }
      }
    },
    checkDestination: function (action, vector) {
      if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest))
          return dest;
      }
    }
  };

  function View(world, vector) {
    this.world = world;
    this.vector = vector;
  }

  View.prototype = {
    look: function (dir) {
      var target = this.vector.plus(directions[dir]);
      if (this.world.grid.isInside(target))
        return charFromElement(this.world.grid.get(target));
      else
        return '#';
    },
    findAll: function (ch) {
      var found = [];
      for (var dir in directions)
        if (this.look(dir) == ch)
          found.push(dir);
      return found;
    },
    find: function (ch) {
      var found = this.findAll(ch);
      if (found.length == 0) return null;

      return Critter.straightElement(found); // let make movement more straight
    }
  };

  function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
  }

  LifelikeWorld.prototype = Object.create(World.prototype);

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

  var actionTypes = Object.create(null);

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

  function elementFromChar(legend, ch) {
    if (ch == ' ')
      return null;
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
  }

  function charFromElement(element) {
    if (element == null)
      return ' ';
    else
      return element.originChar;
  }

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  var directions = Grid.directions;

  var active = null;

  function Animated(world) {
    this.world = world;
    var outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument;
    var node = outer.appendChild(doc.createElement('div'));
    node.style.cssText = 'position: relative; width: intrinsic; width: fit-content;';
    this.pre = node.appendChild(doc.createElement('pre'));
    this.pre.appendChild(doc.createTextNode(world.toString()));
    this.button = node.appendChild(doc.createElement('div'));
    this.button.style.cssText = 'position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; ' +
      'background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;';
    this.button.innerHTML = 'stop';
    var self = this;
    this.button.addEventListener('click', function () {
      self.clicked();
    });
    this.disabled = false;
    if (active) active.disable();
    active = this;
    this.interval = setInterval(function () {
      self.tick();
    }, 333);
  }

  Animated.prototype.clicked = function () {
    if (this.disabled) return;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.button.innerHTML = 'start';
    } else {
      var self = this;
      this.interval = setInterval(function () {
        self.tick();
      }, 333);
      this.button.innerHTML = 'stop';
    }
  };

  Animated.prototype.tick = function () {
    this.world.turn();
    this.pre.removeChild(this.pre.firstChild);
    this.pre.appendChild(this.pre.ownerDocument.createTextNode(this.world.toString()));
  };

  Animated.prototype.disable = function () {
    this.disabled = true;
    clearInterval(this.interval);
    this.button.innerHTML = 'Disabled';
    this.button.style.color = 'red';
  };

  return {
    World: World,
    View: View,
    LifelikeWorld: LifelikeWorld,
    randomElement: randomElement,
    directions: directions,
    start: window.animateWorld = function (world) {
      new Animated(world);
    }
  };
})();