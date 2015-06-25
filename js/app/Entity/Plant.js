//Plant

(function (module) {
  var Plant = function () {
    this.energy = 3 + Math.random() * 4;
    this.entity = '';
  };

  Plant.prototype.act = function (context) {
    if (this.energy > 20) {
      var space = context.find(" ");
      if (space) {
        return {type: "reproduce", direction: space};
      }
    }
    if (this.energy < 20) {
      return {type: "grow"};
    }
  };

  var Grass = function () {
    this.energy = 3 + Math.random * 4;
    this.entity = '*';
  }

//Grass.prototype = new Plant();

  Grass.prototype.act = function (context) {
    if (this.energy > 20) {
      var space = context.find(" ");
      if (space)
        return {type: "reproduce", direction: space};
    }
    if (this.energy < 20) {
      return {type: "grow"};
    }
  };

  module.Plant = Plant;
  module.Plant.Grass = Grass;

})(eLife);