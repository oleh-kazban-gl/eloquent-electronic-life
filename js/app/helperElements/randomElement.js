//Random element

function randomElement(array) {
  //Math.floor round number to integer
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = randomElement;