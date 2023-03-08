/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { Viewport } from './viewport';
import { World } from './world';

export class Player {
  
  height: number;
  width: number;
  
  viewport: Viewport;
  context: CanvasRenderingContext2D;

  public pixel_x: number;
  public pixel_y: number;
  public sizeX: number;
  public sizeY: number;
  public scaledSizeX: number;
  public scaledSizeY: number;
  public position: number;
  public scaled_size: number;
  public direction: string;
  public prev_direction: string;

  public hero_path = null;
  public hero_path_step = 0;

  private world: World;
  private heroImage: HTMLImageElement;

  constructor(
    public coord_x: number, 
    public coord_y: number, 
    public level: number, 
    public raceId: number, 
    world, 
    context, 
    viewport, 
    scaled_size
  ) {
    console.log('INIT: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    console.log('INIT: this.raceId: ' + this.raceId);

    this.context = context;
    this.viewport = viewport;
    this.heroImage = new Image();
    
    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    this.heroImage.src = '../assets/graphics/postacie/' + this.getHeroSpriteSheetName();

    this.sizeX = 32;
    this.sizeY = 32;
    this.scaledSizeX = 64;
    this.scaledSizeY = 64;


    this.scaled_size = scaled_size;
    this.world = world;
    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;
    this.position = this.coord_x + this.coord_y * this.world.columns;
    this.direction = null;
    this.prev_direction = 'down';
    this.level = level;
    console.log('INIT: position: ' + this.position);
  };

  getHeroSpriteSheetName() { 
    switch (this.raceId) {
      case 1: // halfling
        return 'dl-characters-halfling-female.png';
      case 2: // elf
        return 'dl-characters-elf-female.png';
      case 3: // human
        return 'dl-characters-human-male.png';
      case 4: // dwarf
        return 'dl-characters-dwarf-male.png';
      case 5: // troll
        return 'dl-characters-troll-male.png';
      case 6: // vampire
        return 'dl-characters-vampire-male.png';

    }
  }

  animate() {

    const x = this.coord_x * this.scaled_size;
    const y = this.coord_y * this.scaled_size;

    /* Gradually moves the player closer to x, y every time animate() is called. */
    if (x < this.pixel_x)
    {
      this.pixel_x-=4;
    }
    else if (x > this.pixel_x)
    {
      this.pixel_x+=4;
    }
    if (y < this.pixel_y)
    {
      this.pixel_y-=4;
    }
    else if (y > this.pixel_y)
    {
      this.pixel_y+=4;
    }
    //this.pixel_x += (x - this.pixel_x - scaled_size * 0.0) * 0.05;
    //this.pixel_y += (y - this.pixel_y - scaled_size * 0.4) * 0.05;

  }

  updateCoordsAndPixels(x, y){
    this.coord_x = x;
    this.coord_y = y;
    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;
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
    if (this.coord_x === move_x && this.coord_y === move_y){
      return false;
    }
    // TODO: check if have EN, HP, KO... otherwise return with error msg

    // TODO: add "queued-up" move (change destination before reaching current; after current step; (2) in flow chart)
		let currentStep = false;
    if (this.hero_path !== null)
		{
      currentStep = this.hero_path[this.hero_path_step];
    }

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

    // if Hero was already moving, find new path, but add current step as first in the new path
    if (currentStep !== false){
      console.log('currentStep: ' + currentStep);
      //this.hero_path.unshift(currentStep);
    }

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

    this.position = this.coord_x + this.coord_y * this.world.columns;

    this.clearMovementParams();
  }

  moveHeroStep(){
    if (this.hero_path == null){
      return;
    }
console.log('this.world.columns: '+this.world.columns);
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

    this.prev_direction=this.direction;
    console.log('before move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    //console.log('go ' + direction);
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
      case 'top-left':
        this.coord_x--;
        this.coord_y--;
        this.direction='left';
        break;
      case 'bottom-left':
        this.coord_x--;
        this.coord_y++;
        this.direction='left';
        break;
      case 'top-right':
        this.coord_x++;
        this.coord_y--;
        this.direction='right';
        break;
      case 'bottom-right':
        this.coord_x++;
        this.coord_y++;
        this.direction='right';
        break;
              
    }

    this.position = this.coord_x + this.coord_y * this.world.columns;
    console.log('after move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    console.log('after move: position: ' + this.position);
  }

  stop(){
    if (this.direction!=null)
    {
      this.prev_direction=this.direction;
      this.direction=null;
      //console.log('stop');
    }
  }

  drawHero(currentFrameTime){

    /* This bit of code gets the this's position in the world in terms of
       columns and rows and converts it to an index in the map array */
       // let this_index =
       //   Math.floor((this.pixel_y + this.scaledSize * 0.5) / this.scaledSize) * columns
       //   + Math.floor((this.pixel_x + this.scaledSize * 0.5) / this.scaledSize); // ????
   
       let sheetOffsetX = 0;
       let sheetOffsetY = 0;
   
       const milisec = currentFrameTime % 1000;
       //const currentFrame = Math.floor(milisec / 130) + 1;
       const currentFrame = Math.floor(milisec / 125);
   
       switch(this.direction)
       {
         case 'up':
             sheetOffsetY = 1 * this.sizeY;
             sheetOffsetX = currentFrame * this.sizeX;
           break;
         case 'down':
             sheetOffsetY = 1 * this.sizeY; // 2 * this.sizeX;
             sheetOffsetX = currentFrame * this.sizeX;
           break;
         case 'right':
             sheetOffsetY = 1 * this.sizeY;
             sheetOffsetX = currentFrame * this.sizeX;
           break;
         case 'left':
             sheetOffsetY = 2 * this.sizeY; // 1 * this.sizeX;
             sheetOffsetX = (7 - currentFrame) * this.sizeX;
           break;
         default:
             switch(this.prev_direction)
             {
               case 'up':
                   sheetOffsetY = 0; //
                   sheetOffsetX = currentFrame * this.sizeX;
                 break;
               case 'down':
                   sheetOffsetY = 0; // 2 * this.sizeY;
                   sheetOffsetX = currentFrame * this.sizeX;
                 break;
               case 'right':
                   sheetOffsetY = 0 * this.sizeY;
                   sheetOffsetX = (currentFrame % 4) * this.sizeX;
                 break;
               case 'left':
                   sheetOffsetY = 0; // 1 * this.sizeX;
                   sheetOffsetX = currentFrame * this.sizeX;
                 break;
             }
             //sheetOffsetX = 0;
       }
   
   
       this.context.drawImage(
         this.heroImage,
         sheetOffsetX,
         sheetOffsetY,
         this.sizeX,
         this.sizeY,
         Math.round(this.pixel_x - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5),
         Math.round(this.pixel_y - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5),
         this.scaledSizeX,
         this.scaledSizeY
       );
     }

}
