/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * charFromElement: utility function to retrieve char from element
 */

function charFromElement(element) {
  if (element == null) {
    return ' ';
  } else {
    return element.originChar;
  }
}

module.exports = charFromElement;