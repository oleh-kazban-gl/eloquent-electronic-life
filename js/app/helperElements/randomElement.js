//Random element

define([

], function(){
  'use strict';

  function randomElement(array) {
    //Math.floor round number to integer
    return array[Math.floor(Math.random() * array.length)];
  }

  return randomElement;
});