//Element from char

define([

], function(){
  'use strict';

  function elementFromChar(legend, ch) {
    if (ch === ' ') {
      return null;
    }

    var element = new legend[ch]();
    element.originChar = ch;
    return element;
  }

  return elementFromChar;
});