'use strict';

function Wall() {
}

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

function BouncingCritter() {
  this.direction = straightElement(GridModule.directionNames);
};

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) != ' ')
    this.direction = view.find(' ') || 's';
  return {type: 'move', direction: this.direction};
};

function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}