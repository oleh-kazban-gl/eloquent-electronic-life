# Eloquent - Electronic life

## About

Eloquent - Electronic life is simple simulator of artificial (electronic) life.
Here it is randomly generated world with predefined dimensions (the width and
height of world) which is populated of different types of creatures - peaceful
herbivores and bloodthirsty predators.

## World and Symbols

    ############################
    #  @   #    #      o      ##
    #   **                     #
    #          #####           #
    ##         #   #    ##     #
    ###   *      *##     #*    #
    #     **    ###      #**   #
    #   ####         @         #
    #   ##*      o     *   *   #
    # o  #         o       ### #
    #    #             *       #
    ############################

Because we don't use canvas or something like that, we use pseudographics - all
objects are represented as predefined symbols.
Thus we have different symbols which are:
* '#' - some kinf of barrier, is used for building walls of the "world", rocks,
etc.
* '*' - plants, which are grown in our "world". Some creatures can eat them, and
 then something may happend - for example this creature can give birth of new
 creature, or only it's health point can be fixed. Plants are recover themselves
 in time and they will permanently grow up.
* 'o' - peaceful creatures, herbivores. They feeds by '*' plants (by such way
they restore their energy points) and reproduce their children as herbivores
too. The speed of reproduction is quite high, for load balancing of population
of our "world". Herbivores must eat plants to restore energy, otherwise they
will die.
* '@' - predators, who feeds by 'o' herbivores. Their energy points are restored
by eating of herbivores. For world balance their reproducing velocity is not so
high as herbivores one - if predators have not enough of food (herbivores) they
will die.