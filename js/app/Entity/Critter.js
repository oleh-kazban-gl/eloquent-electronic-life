//Critter

(function (module) {

  function Critter() {
    this.energy = 10;
    this.direction = '';
    this.food = [];
    this.entity = '';
  }

//SmartPlantEater
  function SmartPlantEater() {
    this.energy = 30;
    this.direction = 's';
    this.food = ['*', 'o'];
    this.entity = 'o';
  }

//SmartPlantEater.prototype = new Critter();
//SmartPlantEater.__proto__ = Critter;

  SmartPlantEater.prototype.act = function (context) {
    var space = context.find(' ');

    if (this.energy > 100 && space) {
      return {type: 'reproduce', direction: space};
    }

    var plants = context.findAll('*');
    if (plants.length > 1) {
      return {type: 'eat', direction: randomElement(plants)};
    }

    if (context.look(this.direction) != ' ')
      this.direction = context.find(' ') || 's';

    return {type: 'move', direction: this.direction}
  };

//Tiger
  function Tiger() {
    this.energy = 40;
    this.direction = 's';
    this.food = ['o', '@', '*'];
    this.totalFood = [];
    this.entity = '@';
  }

//Tiger.__proto__ = Critter;

  Tiger.prototype.act = function (context) {
    var space = context.find(' ');

    var food = context.findAll('o');
    this.totalFood.push(food.length);

    var foodInTurns = this.totalFood.reduce(function (a, b) {
        return a + b;
      }) / this.totalFood.length;

    if (this.totalFood.length > 6)
      this.totalFood.shift();

    if (this.energy > 200 && space) {
      return {type: 'reproduce', direction: space}
    }

    if (food.length && foodInTurns > 0.25) {
      return {type: 'eat', direction: randomElement(food)}
    }

    if (context.look(this.direction) != ' ')
      this.direction = space || 's';

    return {type: 'move', direction: this.direction};
  };

  module.Critter = Critter;

  module.Critter.SmartPlantEater = SmartPlantEater;
  module.Critter.Tiger = Tiger;

})(eLife);