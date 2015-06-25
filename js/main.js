requirejs.config({
  baseUrl: 'app'
  //paths: {
  //  World: './Universe/World',
  //  Grid: './Universe/Grid'
  //}
});

requirejs(['./Universe/World'], function(World) {
  World.start(Map.plan);
});

//// Universe - World, Map, Grid
//world: 'Universe/World',
//  map: './Universe/Map',
//  grid: './Universe/Grid',
//  // Entities - Barrier, Critter, Plant
//  barrier: './Entity/Barrier',
//  critter: './Entity/Critter',
//  plant: './Entity/Plant'
