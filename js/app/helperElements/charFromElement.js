//Char from element

define([

], function(){
  'use strict';

  function charFromElement(element) {
    if (element == null) {
      return ' ';
    } else {
      return element.originChar;
    }
  }

  return charFromElement;
});