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

## Behaviour of habbitants
Behavior separates to different types. They are:
* eat
* move
* reproduce


At first our critters move through the world, because life is in motion. When
critters travell they look to neighbor cells and detect surroundings. Thus,
critters can define plants, other critters or free cells.


When a critter see the plant in front of it and feels hunger he eat a plant, by
this way restore it power. When critter is very hunger it eats a plant without
any waiting. On the other hand, when critter is full, but there are plants, he
think about food and take random desicion - to eat or not to eat.


Relationships between different entities are not so simple. For example -
reproduction. If our entity has enough strength (it means definite ammount of
energy) - it can reproduce a child, without any attraction from outside. When
critter see in front of it other critter and it has defined ammount of energy,
they may take love night and produce child sexually. But when critter is
hungry and it see other critter, he can eat it. Bloody world ))). And what about
predators? Hey, here they are! Predators are entities with high energy, so they
can travel for a very long time. In opposition of critters predators eat only
herbevores, but they can fight for territory between other predators, if they
are. When predator is very hungry, to prevent death it can eat plants (because
predator don't want to die). If our herbivore see a predator in the front and
has some free space to run - it will go away, because of safety first.


For load balancing of environment herbivores reproduces themselves very fast,
but predators controll their population.


All activity is logged to console. so you can simply see, what's happening. For
instance, message stack of herbivores:
* *O: energy: 17.58 , hungry: 0.56 , probability: 0.33, eat? : true*: This is
statistic message, here we can see the energy of critter, how hungry it is,
what is probability to eat a plant if it see, and what is the decision - to eat
or to not to eat.
* *O: eat*: critter eats a plant.
* *O: move*: critter is travelling through the world.
* *O: is running from predator*: criiter has seen a predator and has an
opportunity to run out.
* *O: New little critter appears!*: message from critter that new critters
birth. This is happening when critter has enough energy for that.
* *O: Time for love!!! energy: 34.78*: hot time ))).
* *O: Omnomnom energy: 9.91*: this is the fact of cannibalism - one critter is
so hungry that it eats another critter.


Messages for predators:
* *@: move, energy: 190*: preadtor is investigating its territory
* *@: Yami-yami )))*: predator hunts a critter
* *@: Predator is so hungry that it eats the plants!* when predator is
critically hungry, it can eat a plant to be still alive.
* *@: New predator appears!*: message from predator that new predator appears.
This is happening when predator has enough energy for that.
* *@: It's time for love!!! New predator appears!*: hot time ))).
* *@: FIGHT!!!*: predator meets another predator and fights for territory. Each
figth predator spent some energy.
