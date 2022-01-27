/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { World } from './world';

export class Player {

  public pixel_x: number;
  public pixel_y: number;
  public position: number;
  public scaled_size: number;
  public direction: string;
  public prev_direction: string;

  public hero_path = null;
  public hero_path_step = 0;

  private world: World;

  constructor(public coord_x: number, public coord_y: number, world, scaled_size) {
    this.scaled_size = scaled_size;
    this.world = world;
    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;
    this.position = this.coord_x + this.coord_y * 200;
    this.direction = null;
    this.prev_direction = 'down';
  };

  animate() {

    const x = this.coord_x * this.scaled_size;
    const y = this.coord_y * this.scaled_size;

    /* Gradually moves the player closer to x, y every time animate() is called. */
    if (x < this.pixel_x)
    {
      this.pixel_x-=1;
    }
    else if (x > this.pixel_x)
    {
      this.pixel_x+=1;
    }
    if (y < this.pixel_y)
    {
      this.pixel_y-=1;
    }
    else if (y > this.pixel_y)
    {
      this.pixel_y+=1;
    }
    //this.pixel_x += (x - this.pixel_x - scaled_size * 0.0) * 0.05;
    //this.pixel_y += (y - this.pixel_y - scaled_size * 0.4) * 0.05;

  }

  // document.addEventListener('keydown', logKey);

  // function logKey(e) {
  //   if (`${e.code}` == 'ArrowRight')
  //   {
  //     player.repositionTo(++player.coord_x, player.coord_y);
  //   }
  //   if (`${e.code}` == 'ArrowDown')
  //   {
  //     player.repositionTo(player.coord_x, ++player.coord_y);
  //   }
  //   if (`${e.code}` == 'ArrowLeft')
  //   {
  //     player.repositionTo(--player.coord_x, player.coord_y);
  //   }
  //   if (`${e.code}` == 'ArrowUp')
  //   {
  //     player.repositionTo(player.coord_x, --player.coord_y);
  //   }
  // }

  moveHero(move_x, move_y)
	{
    // TODO: check if have EN, HP, KO... otherwise return with error msg

    // TODO: add "queued-up" move (change destination before reaching current; after current step; (2) in flow chart)
		if (this.hero_path !== null)
		{
      return;
    }

    console.log(
      'Going from ('+ this.coord_x+', '+ this.coord_y + ')='+(this.coord_x + this.coord_y *200)
      +' to ('+ move_x+', '+ move_y + ')='+(move_x + move_y *200)+'');

    const destination = move_x + move_y*200;

    const positionAccessible = this.world.positionAccessible(destination);
    if (positionAccessible !== true)
    {
      // eslint-disable-next-line @typescript-eslint/quotes
      return "You can't walk into " + positionAccessible;
    }

    const pathfinder = new HeroPath(this.world, this.coord_x, this.coord_y, move_x, move_y);
    this.hero_path = pathfinder.findSteps();

    let hero_path_string = '';
    this.hero_path_step = 0;

    if (this.hero_path.length > 0)
    {
      for (const hero_step of this.hero_path)
      {
        hero_path_string += hero_step + ';';
      }
      console.log('Path to reach this destination is: '+hero_path_string);
    }
    else // means we got empty array in this.hero_path
    {
      this.hero_path = null;
      // eslint-disable-next-line @typescript-eslint/quotes
      return "I can't find a way...";
    }

    return true;
	}

  incrementHeroStep(){
    this.hero_path_step++;

    if (this.hero_path_step >= this.hero_path.length){
			this.clearMovementParams();
		}
  }

  clearMovementParams(){
    this.hero_path_step = 0;
    this.hero_path = null;
    this.direction = null;
  }

  revertHeroLastStep(){
    switch(this.direction)
		{
			case 'right':
        this.coord_x--;
				break;
			case 'left':
				this.coord_x++;
				break;
			case 'down':
        this.coord_y--;
				break;
			case 'up':
				this.coord_y++;
				break;
		}

    this.position = this.coord_x + this.coord_y * 200;

    this.clearMovementParams();
  }

  moveHeroStep(){
    if (this.hero_path == null){
      return;
    }

		switch(this.hero_path[this.hero_path_step])
		{
			case 1:
				this.go('right');
				break;
			case -1:
				this.go('left');
				break;
			case 200:
				this.go('down');
				break;
			case -200:
				this.go('up');
				break;
		}
	}

  go(direction){

    this.prev_direction=this.direction;

    console.log('go ' + direction);
    switch (direction)
    {
      case 'up':
        this.coord_y--;
        this.direction='up';
        break;
      case 'down':
        this.coord_y++;
        this.direction='down';
        break;
      case 'right':
        this.coord_x++;
        this.direction='right';
        break;
      case 'left':
        this.coord_x--;
        this.direction='left';
        break;
    }

    this.position = this.coord_x + this.coord_y * 200;
  }

  stop(){
    if (this.direction!=null)
    {
      this.prev_direction=this.direction;
      this.direction=null;
      console.log('stop');
    }
  }

}
