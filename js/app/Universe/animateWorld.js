//Animate world

var world = require('./Plan');

function refreshMap() {
  world.turn();
  console.log(world.toString());
}

function live() {
  for (var count = 0; count < 10; count++) {
    refreshMap();
  }
}

module.exports = live;