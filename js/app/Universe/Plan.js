//World plan

var Barrier = require('../Entity/Barrier');
var Critter = require('../Entity/Critter');
var Plant = require('../Entity/Plant');
var LifeLikeWorld = require('./LifeLikeWorld');

var map = [
  '########################################################################################################',
  '#                 ####         ****                          *  *  **                ***      o      ###',
  '#   *  @  ##                 ########       oo                                       ****             ##',
  '#   *    ##        o o                 ****                ###               ###     * *   ###        *#',
  '#       ##*                        ##########         @      ##*       ##     ###          ### o      *#',
  '#      ##***  *         ****                                 ##*       ***          @     ##         **#',
  '#* **  #  *  ***      #########                               ###                        ##          **#',
  '#* **  #      *               #   *         ##         @                     o                       **#',
  '#     ##              #   o   #  ***         ###              #                                   ######',
  '#*            @       #       #   *        o  ##             ###      o    ####                   #    #',
  '#*                    #  ######                             ###              ***#####     o         ** #',
  '###          ****          ***                                                                      ** #',
  '#       o                                  o       # ###      **                                       #',
  '#   *     ##  ##  ##  ##               ###         #########  ***        ####        ##             *  #',
  '#   **         #              *       #####  o     *****####             ####****   ###   o            #',
  '##  **  o   o  #  #    ***  ***        ###              ****       o       ######                   ** #',
  '###               #   *****                                                                        ****#',
  '########################################################################################################'
];

var description = {
  '#': Barrier.wall,
  'o': Critter.smartPlantEater,
  '@': Critter.tiger,
  //'*': Plant.grass
  '*': Plant.plant
};

var valley = new LifeLikeWorld(map, description);

module.exports = valley;



