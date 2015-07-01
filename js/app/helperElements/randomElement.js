/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * randomElement: utility function to retrieve random element
 */

define(function(){
  'use strict';

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  return randomElement;
});