/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * This is used for world animation
 */

var world = require('./Plan');
var calcEntities = require('../helperElements/calcElements');

function refreshMap() {
  window.interval = setInterval(function(){
    world.turn();
    document.getElementById('world').innerHTML = world.toString();
    document.getElementById('ticksCounter').innerHTML = 'World ticks since creation: ' + world.tickCounter;
    document.getElementById('worldObjects').innerHTML = '<h3>Entities:</h3>' +
      'Plants: ' + calcEntities().plants + '<br>' +
      'PlantEaters: ' + calcEntities().plantEaters + '<br>' +
      'Tigers: ' + calcEntities().tigers;
  }, 333);
}

module.exports = refreshMap;