//Lifelike World

define([
  'app/Universe/World',
  'app/Universe/View',
  'app/Entity/Actions'
], function(World, View, Actions){
  'use strict';

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

  return LifelikeWorld;
});