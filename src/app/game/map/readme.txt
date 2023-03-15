Class responsibilities
=============================
1. MapComponent:
  - I/O (user input, output to screen)
  - displays quests, locations (inside)
  - handles actions like "subway", travel, startMining

  
1b. MapGfxComponent (child of MapComponent)
  - game loop
  - render World, render Hero
  - animation (moves Hero on the screen, 1 pixel at a time)
  - sends Request to API when new move (step is initiated)
  - receives Response from API to update Hero stats and correct Hero position (if illegal move)


2. Player
  - stores Hero path, direction, current step in that path
  - stores Hero exact position in terms of pixels

3. HeroPath
  - responsible for calculating hero path based on current position and requested destination
    - used by Player

4. World
  - stores information about the whole world's terrain (map)
  - stores information about all monsters
  - determines if a position is reachable (used by: HeroPath)
  - USED BY: MapComponent, MapGfxComponent, Player and HeroPath




In map component there are numerous calls to Player class:

Attributes:
1. player.direction - is used only in my Map component to animate player
2. coord_x and coord_y - hold player location as saved in DB (0..199, 0..199)
2. pixel_x and pixel_y - hold player location in pixels, used for animation to know exatly where to display hero


Methods:
1. ON CLICK ON THE MAP
this.player.moveHero(move_x, move_y) - move_x and move_y are both (0..199) = coords on the world map

  - find this.hero_path  for the hero to follow
  - proceeds with the fist step of this path (this.player.moveHeroStep())

2. INSIDE LOOP() via this.tryHeroNextStep(); -

PURPOSE: change player coords, send this info to server

    if ("Hero reach next step in terms of pixels")
    {
      if (this.player.hero_path != null)
      {
        // proceed with next step
        this.player.moveHeroStep();
      }
      else
      {
        // or make hero stand still
        this.player.stop();
      }
    }

    a) this.player.moveHeroStep();
      based on hero path, executes one of the four:
        this.go('right');
        this.go('left');
        this.go('down');
        this.go('up');

      - sets player.direction
      - changes coord_x OR coord_y (+1 OR -1) to reflect new coords


    b) this.player.stop();
      sets player.direction to NULL

3. INSIDE LOOP() via this.player.animate();

PURPOSE: change hero actual position (in pixels) for animation

    - changes this.pixel_x or this.pixel_y (+1 OR -1) to move hero closer to next step coords
