/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * This is used for world animation
 */

define(function (require) {
  'use strict';

  var world = require('app/Universe/Plan');
  var calcEntities = require('app/helperElements/calcElements');

  function refreshMap() {
    window.interval = setInterval(function(){
      world.turn();
      document.getElementById('world').innerHTML = world.toString();
      document.getElementById('ticksCounter').innerHTML = 'World ticks since creation: ' + world.tickCounter;
      document.getElementById('worldObjects').innerHTML = 'Entities: ' + '\n' +
      'Plants: ' + calcEntities().plants + '\n' +
      'PlantEaters: ' + calcEntities().plantEaters + '\n' +
      'Tigers: ' + calcEntities().tigers;
    }, 333);
  }

  return refreshMap();
});