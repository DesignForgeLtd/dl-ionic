/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { World } from './world';

export class Player {

  public x: number;
  public y: number;
  public scaled_size: number;
  public direction: string;
  public prev_direction: string;

  public hero_path = null;
  public hero_path_step = 0;

  private world: World;

  constructor(public pos_x: number, public pos_y: number, world, scaled_size) {
    this.scaled_size = scaled_size;
    this.world = world;
    this.x = this.pos_x * this.scaled_size; // pixels
    this.y = this.pos_y * this.scaled_size;
    this.direction = null;
    this.prev_direction = 'down';
  };

  go(direction){

    this.prev_direction=this.direction;

    switch (direction)
    {
      case 'up':
        this.pos_y--;
        this.direction='up';
        break;
      case 'down':
        this.pos_y++;
        this.direction='down';
        break;
      case 'right':
        this.pos_x++;
        this.direction='right';
        break;
      case 'left':
        this.pos_x--;
        this.direction='left';
        break;
    }
    console.log('before');
    //$.post({url: url = 'api/player/move/'+((this.pos_y*200)+this.pos_x)}).done(function(data){
      // $('#stats').html(data);
      // console.log('done');
    // });

  }

  stop(){
    if (this.direction!=null)
    {
      this.prev_direction=this.direction;
      this.direction=null;
    }
  }

  repositionTo(x, y) {

    /* change the (X, Y) coords of the player */
    this.pos_x = x;
    this.pos_y = y;

    this.moveTo(x * this.scaled_size, y * this.scaled_size);
  }

  moveTo(x, y) {

    /* Gradually moves the player closer to x, y every time moveTo is called. */
    if (x < this.x)
    {
      this.x-=2;
    }
    else if (x > this.x)
    {
      this.x+=2;
    }
    if (y < this.y)
    {
      this.y-=2;
    }
    else if (y > this.y)
    {
      this.y+=2;
    }
    //this.x += (x - this.x - scaled_size * 0.0) * 0.05;
    //this.y += (y - this.y - scaled_size * 0.4) * 0.05;

  }

  // document.addEventListener('keydown', logKey);

  // function logKey(e) {
  //   if (`${e.code}` == 'ArrowRight')
  //   {
  //     player.repositionTo(++player.pos_x, player.pos_y);
  //   }
  //   if (`${e.code}` == 'ArrowDown')
  //   {
  //     player.repositionTo(player.pos_x, ++player.pos_y);
  //   }
  //   if (`${e.code}` == 'ArrowLeft')
  //   {
  //     player.repositionTo(--player.pos_x, player.pos_y);
  //   }
  //   if (`${e.code}` == 'ArrowUp')
  //   {
  //     player.repositionTo(player.pos_x, --player.pos_y);
  //   }
  //   if (`${e.code}` == 'Space')
  //   {
  //     moveHero(1,1);
  //   }
  // }

  moveHero(move_x, move_y)
	{
		console.log(
      'Going from ('+ this.pos_x+', '+ this.pos_y + ')='+(this.pos_x + this.pos_y *200)
      +' to ('+ move_x+', '+ move_y + ')='+(move_x + move_y *200)+'');

		if (this.hero_path == null)
		{
			const pathfinder = new HeroPath(this.world, this.pos_x, this.pos_y, move_x, move_y);
			this.hero_path = pathfinder.findSteps();

			let hero_path_string = '';
			if (this.hero_path != null)
			{
				for (const hero_step of this.hero_path)
				{
					hero_path_string += hero_step + ';';
				}

				this.moveHeroStep();
			}
			else
			{
				//nieruszyLoad('brak_sciezki-0');
			}

		}
		else
		{
			this.moveHeroStep();
		}
	}

  moveHeroStep()
	{
		//wymazPostaciZMapy();
		//pozycja += hero_path[hero_path_step];

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

		this.hero_path_step++;

		if (this.hero_path_step === this.hero_path.length)
		{
			//wymazPostaciZMapy();
			//rysujPostaciNaMapie();

			//rysujPostaciNaMapie();
			//akcjeAjax(akcjeAjaxData);

			this.hero_path_step = 0;
			this.hero_path = null;
		}

		//rysujPostaciNaMapie('tylko_ja');
	}

}
