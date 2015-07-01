/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Plan: combining of map and description of signs
 */

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
  '#': Barrier,
  'o': Critter.smartPlantEater,
  '@': Critter.tiger,
  '*': Plant
};

var valley = new LifeLikeWorld(map, description);

module.exports = valley;