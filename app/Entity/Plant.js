'use strict';

var Plant = (function () {
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

  return {
    plant: Plant
  }
})();
