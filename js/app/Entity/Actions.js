//Action handler

define([
  'app/helperElements/elementFromChar'
], function(elementFromChar){
  'use strict';

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

  return actionTypes;
});
