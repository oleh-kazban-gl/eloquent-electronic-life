//Animate world

define([
  'app/Universe/Plan',
], function (world) {
  'use strict';

  function refreshMap() {
    window.interval = setInterval(function(){
      world.turn();
      document.getElementById('world').innerHTML = world.toString();
    }, 333);
  }

  return refreshMap();
});