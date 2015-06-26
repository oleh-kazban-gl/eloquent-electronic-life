requirejs.config({
  baseUrl: 'js',
  paths: {
    ////Entities
    //Actions: 'app/Entity/Actions',
    //Barrier: 'app/Entity/Barrier',
    //Critter: 'app/Entity/Critter',
    //Plant: 'app/Entity/Plant',
    ////Universe
    //animateWorld: 'app/Universe/animateWorld',
    //Directions: 'app/Universe/Directions',
    //Elements: 'app/Universe/Elements',
    //Grid: 'app/Universe/Grid',
    //Plan: 'app/Universe/Plan',
    //Vector: 'app/Universe/Vector',
    //View: 'app/Universe/View',
    //World: 'app/Universe/World'
    app: 'app/'
  }
});

//requirejs([
//  'app/Universe/animateWorld',
//  'app/Universe/Plan'
//], function (plan) {
//  animateWorld(plan);
//});

require([
    "app/Universe/animateWorld"
  ],
  function (Animateworld) {
  });


//requirejs(['./Universe/World'], function(World) {
//  World.start(Map.plan);
//});

//// Universe - World, Map, Grid
//world: 'Universe/World',
//  map: './Universe/Map',
//  grid: './Universe/Grid',
//  // Entities - Barrier, Critter, Plant
//  barrier: './Entity/Barrier',
//  critter: './Entity/Critter',
//  plant: './Entity/Plant'
