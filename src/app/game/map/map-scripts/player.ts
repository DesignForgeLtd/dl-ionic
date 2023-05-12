/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { World } from './world';
import { Injectable } from "@angular/core";
import { Hero } from './Hero';

@Injectable({providedIn: 'root'})

export class Player {
  
  public position: number;
  public direction: string; // takes 8 different values NSWE and diagonals

  public hero_path = null;
  public hero_path_step = 0;

  // lastFrameRenderDuration;
  // lastFrameRenderTime = 0;
  // framesRenderedInStep = 0;
  // averageFrameRenderDuration;
  // totalRenderDuration = 0;

  public coord_x: number;
  public coord_y: number; 
  public level: number;
  public raceId: number; 
  public scaled_size: number;

  public hero: Hero; // TODO: make private and resolve issues related to this

  constructor(private world: World) {
    this.direction = null;
  };

  setPlayerData(
    coord_x: number, 
    coord_y: number, 
    level: number, 
    raceId: number, 
    scaled_size: number
  )
  {
    this.coord_x = coord_x; 
    this.coord_y = coord_y;
    this.level = level;
    this.raceId = raceId; 
    this.scaled_size = scaled_size;

    // TODO: REMOVE THIS LINE
    this.raceId = 4;

    this.hero = new Hero(this.raceId, this.coord_x, this.coord_y);

    // console.log('INIT: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    // console.log('INIT: this.raceId: ' + this.raceId);

    this.position = this.coord_x + this.coord_y * this.world.columns;
  }


  moveHero(move_x, move_y)
	{
    if (this.coord_x === move_x && this.coord_y === move_y){
      this.hero.clearHeroAnimationParams();
      return false;
    }

    // disable changing direction before reaching current target destination
    if (this.hero_path !== null)
		{
      //return false; // it was here to fix a bug, but seems it's gone now. we can probably remove it
    }

    // TODO: check if have EN, HP, KO... otherwise return with error msg

    // TODO: add "queued-up" move (change destination before reaching current; after current step; (2) in flow chart) -- already added ???

    //TODO: what's this logic?
		let currentStep = false;
    if (this.hero_path !== null)
		{
      currentStep = this.hero_path[this.hero_path_step];
    }
    //TODO: end

    console.log(
      'Going from ('+ this.coord_x+', '+ this.coord_y + ')='+(this.coord_x + this.coord_y * this.world.columns)
      +' to ('+ move_x+', '+ move_y + ')='+(move_x + move_y *this.world.columns)+'');

    const destination = move_x + move_y*this.world.columns;

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
      return 'I can\'t find a way...';
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

    this.hero.clearHeroAnimationParams();
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
      case 'top-left':
        this.coord_x++;
        this.coord_y++;
        break;
      case 'bottom-left':
        this.coord_x++;
        this.coord_y--;
        break;
      case 'top-right':
        this.coord_x--;
        this.coord_y++;
        break;
      case 'bottom-right':
        this.coord_x--;
        this.coord_y--;
        break;
		}

    this.position = this.coord_x + this.coord_y * this.world.columns;

    this.clearMovementParams();
  }

  moveHeroStep(){
    if (this.hero_path == null){
      return;
    }

    // console.log('this.world.rows: '+this.world.rows);
    // console.log('this.world.columns: '+this.world.columns);
		
    switch(this.hero_path[this.hero_path_step])
		{
			case 1:
				this.go('right');
				break;
			case -1:
				this.go('left');
				break;
			case this.world.columns:
				this.go('down');
				break;
			case -1 * this.world.columns:
				this.go('up');
				break;
      case this.world.columns - 1:
        this.go('bottom-left');
        break;
			case -1 * this.world.columns - 1:
				this.go('top-left');
				break;
			case -1 * this.world.columns + 1:
				this.go('top-right');
				break;
			case this.world.columns + 1:
				this.go('bottom-right');
				break;
		}
	}

  go(direction){

    //console.log('before move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    //console.log('go ' + direction);
    switch (direction)
    {
      case 'up':
        this.coord_y--;
        this.direction='up';
        this.hero.msToMoveOneSquare = 500;
        break;
      case 'down':
        this.coord_y++;
        this.direction='down';
        this.hero.msToMoveOneSquare = 500;
        break;
      case 'right':
        this.coord_x++;
        this.direction='right';
        this.hero.setOrientation('right');
        this.hero.msToMoveOneSquare = 500;
        break;
      case 'left':
        this.coord_x--;
        this.direction='left';
        this.hero.setOrientation('left');
        this.hero.msToMoveOneSquare = 500;
        break;
      case 'top-left':
        this.coord_x--;
        this.coord_y--;
        this.direction='top-left';
        //this.direction='left';
        this.hero.setOrientation('left');
        this.hero.msToMoveOneSquare = 700;
        break;
      case 'bottom-left':
        this.coord_x--;
        this.coord_y++;
        this.direction='bottom-left';
        //this.direction='left';
        this.hero.setOrientation('left');
        this.hero.msToMoveOneSquare = 700;
        break;
      case 'top-right':
        this.coord_x++;
        this.coord_y--;
        this.direction='top-right';
        //this.direction='right';
        this.hero.setOrientation('right');
        this.hero.msToMoveOneSquare = 700;
        break;
      case 'bottom-right':
        this.coord_x++;
        this.coord_y++;
        this.direction='bottom-right';
        //this.direction='right';
        this.hero.setOrientation('right');
        this.hero.msToMoveOneSquare = 700;
        break;
              
    }

   // this.direction = direction; // TODO: remove 8x from switch above

    this.position = this.coord_x + this.coord_y * this.world.columns;
    // console.log('after move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    // console.log('after move: position: ' + this.position);
  }

  stop(){
    if (this.direction!=null)
    {
      this.direction=null;
      //console.log('stop');

      this.clearMovementParams();
    }
  }

}
