/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * LifelikeWorld: is used for bringing life to objects
 */

define(function(require){
  'use strict';

  var World = require('app/Universe/World');
  var View = require('app/Universe/View');
  var Actions = require('app/Entity/Actions');

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