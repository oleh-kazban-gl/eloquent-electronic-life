'use strict';

var Map = function () {
  var map = [
    '####################################################',
    '#                 ####         ****              ###',
    '#   *  @  ##                 ########       OO    ##',
    '#   *    ##        O O                 ****       *#',
    '#       ##*                        ##########     *#',
    '#      ##***  *         ****                     **#',
    '#* **  #  *  ***      #########                  **#',
    '#* **  #      *            ***#   *              **#',
    '#     ##              #   O **#  ***          ######',
    '#*            @       #      *#   *        O  #    #',
    '#*                    # *######                 ** #',
    '###          ****          ***                  ** #',
    '#       O                        @         O       #',
    '#   *     ##  ##  ##  ##               ###      *  #',
    '#   **         #              *       #####  O     #',
    '##  **  O   O  #  #    ***  ***        ###      ** #',
    '###               #   *****                    ****#',
    '####################################################'
  ];

  var description = {
    '#': Barrier.wall,
    'O': Critter.plantEater,
    '@': Critter.predator,
    '*': Plant.plant
  };

  var world = new World.LifelikeWorld(map, description);

  return {
    plan: world,
    map: map,
    description: description
  };
}();
