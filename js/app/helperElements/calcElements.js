/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * calcEntities: utility function for parsing of world and retrieving ammount
 * of habitats.
 */

define(function (require) {
  'use strict';

  var world = require('app/Universe/Plan');

  function calcEntities() {
    var entities = world.toString().split('\n');
    var plants = 0;
    var plantEaters = 0;
    var tigers = 0;
    var plantSign = '*';
    var plantEaterSign = 'o';
    var tigerSign = '@';

    for (var count = 0; count < entities.length; count++) {
      var line = entities[count].split('');
      for (var i = 0; i < line.length; i++) {
        if (line[i] === plantSign) {
          plants++;
        }
        if (line[i] === plantEaterSign) {
          plantEaters++;
        }
        if (line[i] === tigerSign) {
          tigers++;
        }
      }
    }

    return {
      plants: plants,
      plantEaters: plantEaters,
      tigers: tigers
    };
  }

  return calcEntities;
});
