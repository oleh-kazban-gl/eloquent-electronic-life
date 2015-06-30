//Plant

define([

], function () {
  'use strict';

  var Plant = function () {
    this.energy = 3 + Math.random() * 4;
    this.entity = '*';
    this.information = {};
  };

  Plant.prototype.act = function (context) {
    this.information = {
      entity: this.entity,
      energy: this.energy
    };

    if (this.energy > 20) {
      var space = context.find(' ');
      if (space) {
        this.information.action = 'reproduce';
        console.log(this.information);

        return {type: 'reproduce', direction: space};
      }
    }
    if (this.energy < 20) {
      this.information.action = 'grow';
      console.log(this.information);

      return {type: 'grow'};
    }
  };

  var Grass = function () {
    this.energy = 3 + Math.random * 4;
    this.entity = '*';
    this.information = {};
  };

//Grass.prototype = new Plant();

  Grass.prototype.act = function (context) {

    this.information = {
      entity: this.entity,
      energy: this.energy
    };

    if (this.energy > 20) {
      var space = context.find(' ');
      if (space) {
        this.information.action = 'reproduce';
        //console.log(this.information);

        return {type: 'reproduce', direction: space};
      }
    }

    if (this.energy < 20) {
      this.information.action = 'grow';
      //console.log(this.information);

      return {type: 'grow'};
    }
  };

  return {
    plant: Plant,
    grass: Grass
  }
});