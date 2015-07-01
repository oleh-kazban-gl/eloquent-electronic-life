/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * elementFromChar: utility function to retrieve element from char
 */

function elementFromChar(legend, ch) {
  if (ch === ' ') {
    return null;
  }

  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

module.exports = elementFromChar;