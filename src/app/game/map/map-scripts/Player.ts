/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from "@angular/core";

import { HeroPath } from './HeroPath';
import { World } from './World';
import { Hero } from './Hero';

@Injectable({providedIn: 'root'})

export class Player {
  
  public level: number; // world level
  public hero: Hero; // TODO: make private and resolve issues related to this

  constructor(private world: World) {};

  setPlayerData(
    id: number, 
    coord_x: number, 
    coord_y: number, 
    level: number, 
    raceId: number
  )
  {
    this.level = level;
    
    // TODO: REMOVE THIS LINE
    raceId = 4;

    this.hero = new Hero(id, raceId, coord_x, coord_y, true);
  }


  movePlayerHero(move_x, move_y)
	{
    if (this.hero.coord_x === move_x && this.hero.coord_y === move_y){
      this.hero.clearHeroAnimationParams();
      return false;
    }

    // disable changing direction before reaching current target destination
    if (this.hero.hero_path !== null)
		{
      //return false; // it was here to fix a bug, but seems it's gone now. we can probably remove it
    }

    // TODO: check if have EN, HP, KO... otherwise return with error msg

    // TODO: add "queued-up" move (change destination before reaching current; after current step; (2) in flow chart) -- already added ???

    //TODO: what's this logic?
		let currentStep = false;
    if (this.hero.hero_path !== null)
		{
      currentStep = this.hero.hero_path[this.hero.hero_path_step];
    }
    //TODO: end

    console.log(
      'Going from ('+ this.hero.coord_x+', '+ this.hero.coord_y + ')='+(this.hero.coord_x + this.hero.coord_y * this.world.columns)
      +' to ('+ move_x+', '+ move_y + ')='+(move_x + move_y *this.world.columns)+'');

    const destination = move_x + move_y*this.world.columns;

    const positionAccessible = this.world.positionAccessible(destination);
    if (positionAccessible !== true)
    {
      // eslint-disable-next-line @typescript-eslint/quotes
      return "You can't walk into " + positionAccessible;
    }

    const pathfinder = new HeroPath(this.world, this.hero.coord_x, this.hero.coord_y, move_x, move_y);
    this.hero.hero_path = pathfinder.findSteps();

    let hero_path_string = '';
    this.hero.hero_path_step = 0;

    if (this.hero.hero_path.length > 0)
    {
      for (const hero_step of this.hero.hero_path)
      {
        hero_path_string += hero_step + ';';
      }
      console.log('Path to reach this destination is: '+hero_path_string);
    }
    else // means we got empty array in this.hero_path
    {
      this.hero.hero_path = null;
      return 'I can\'t find a way...';
    }

    return true;
	}


}
