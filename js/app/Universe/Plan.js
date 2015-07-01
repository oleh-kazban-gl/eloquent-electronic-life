/**
 * @license eLife 1.0 Copyright (c) 2015, Oleh Kazban All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: https://github.com/olehkazban/eloquent-electronic-life for details
 *
 * Plan: combining of map and description of signs
 */

define(function(require){
  'use strict';

  var Barrier = require('app/Entity/Barrier');
  var Critter = require('app/Entity/Critter');
  var Plant = require('app/Entity/Plant');
  var LifelikeWorld = require('app/Universe/LifelikeWorld');

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

  var valley = new LifelikeWorld(map, description);
  return valley;
});