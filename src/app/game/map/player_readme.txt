In map component there are numerous calls to Player class:

Attributes:
1. player.direction - is used only in my Map component to animate player


Methods:
1. ON CLICK ON THE MAP
this.player.moveHero(move_x, move_y) - move_x and move_y are both (0..199) = coords on the world map

2. INSIDE LOOP() via this.tryMoveHero(); -

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
      - changes pos_x OR pos_y (+1 OR -1) to reflect new coords


    b) this.player.stop();
      sets player.direction to NULL

3. INSIDE LOOP() via this.player.repositionTo(this.player.pos_x, this.player.pos_y);

PURPOSE: change hero actual position (in pixels) for animation

    - sets player.pos_x and player.pos_y (coords)
    - fires player.moveTo(x, y) (pixels)
