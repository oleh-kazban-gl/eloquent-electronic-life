'use strict';

var plan = [
  '############################',
  '#      #    #      o      ##',
  '#                          #',
  '#          #####           #',
  '##         #   #    ##     #',
  '###           ##     #     #',
  '#           ###      #     #',
  '#   ####                   #',
  '#   ##       o             #',
  '# o  #         o       ### #',
  '#    #                     #',
  '############################'
];

//Let make critter movement more straightforward, not like broun's movement
function straightElement(array) {
  for (var count = 0; count < array.length; count++) {
    if (array[count] === 's') {
      return 's';
    } else {
      return array[Math.floor(Math.random() * array.length)];
    }
  }
}

//var world = new WorldModule.World(plan, {
//  '#': Wall,
//  'o': BouncingCritter
//});


//var valley = new WorldModule.LifelikeWorld(
//  [
//    '############################',
//    '#####                 ######',
//    '##   ***                **##',
//    '#   *##**         **  O  *##',
//    '#    ***     O    ##**    *#',
//    '#       O         ##***    #',
//    '#                 ##**     #',
//    '#   O       #*             #',
//    '#*          #**       O    #',
//    '#***        ##**    O    **#',
//    '##****     ###***       *###',
//    '############################'
//  ],
//  {
//    '#': Wall,
//    'O': PlantEater,
//    '*': Plant
//  }
//);

var smartValley = new WorldModule.LifelikeWorld(
  [
    "####################################################",
    "#                 ####         ****              ###",
    "#   *  @  ##                 ########       OO    ##",
    "#   *    ##        O O                 ****       *#",
    "#       ##*                        ##########     *#",
    "#      ##***  *         ****                     **#",
    "#* **  #  *  ***      #########                  **#",
    "#* **  #      *               #   *              **#",
    "#     ##              #   O   #  ***          ######",
    "#*            @       #       #   *        O  #    #",
    "#*                    #  ######                 ** #",
    "###          ****          ***                  ** #",
    "#       O                        @         O       #",
    "#   *     ##  ##  ##  ##               ###      *  #",
    "#   **         #              *       #####  O     #",
    "##  **  O   O  #  #    ***  ***        ###      ** #",
    "###               #   *****                    ****#",
    "####################################################"
  ],
  {
    '#': Wall,
    'O': SmartPlantEater,
    '@': Predator,
    '*': Plant
  }
);