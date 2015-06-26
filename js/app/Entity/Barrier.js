//Barrier

define([

], function () {
  'use strict';

  function Barrier() {}

//Wall
  function Wall() {}

  //Wall.prototype = new Barrier();

  return {
    barrier: Barrier,
    wall: Wall
  }
});