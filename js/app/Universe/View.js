/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * View: what entity see right in front
 */

define(function(require){
  'use strict';

  var directions = require('app/Universe/directions');
  var charFromElement = require('app/helperElements/charFromElement');
  var randomElement = require('app/helperElements/randomElement');

  function View(World, Vector) {
    this.world = World;
    this.vector = Vector;
  }

  View.prototype.look = function (dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
      return charFromElement(this.world.grid.get(target));
    else
      return '#';
  };

  View.prototype.findAll = function (ch) {
    var found = [];
    for (var dir in directions) {
      if (this.look(dir) == ch)
        found.push(dir);
    }
    return found;
  };

  View.prototype.find = function (ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
  };

  return View;
});