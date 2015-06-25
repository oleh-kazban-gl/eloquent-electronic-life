//Directions

(function (module) {
  var directions = {
    "n": new module.Vector(0, -1),
    "ne": new module.Vector(1, -1),
    "e": new module.Vector(1, 0),
    "se": new module.Vector(1, 1),
    "s": new module.Vector(0, 1),
    "sw": new module.Vector(-1, 1),
    "w": new module.Vector(-1, 0),
    "nw": new module.Vector(-1, -1)
  };

  var directionNames = "n ne e se s sw w nw".split(" ");

  module.directions = directions;
  module.directionNames = directionNames;

})(eLife);

function randomElement(array) {
  //Math.floor round number to integer
  return array[Math.floor(Math.random() * array.length)];
}