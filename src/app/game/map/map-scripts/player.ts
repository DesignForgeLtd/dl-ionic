/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { Viewport } from './viewport';
import { World } from './world';

export class Player {
  
  height: number;
  width: number;
  
  // viewport: Viewport;
  // context: CanvasRenderingContext2D;
  viewport: number;
  context: number;

  public pixel_x: number;
  public pixel_y: number;
  public sizeX: number;
  public sizeY: number;
  public scaledSizeX: number;
  public scaledSizeY: number;
  public position: number;
  public scaled_size: number;
  public direction: string;
  public orientation: string;

  public hero_path = null;
  public hero_path_step = 0;

  private world: World;
  private heroImage: HTMLImageElement;
  private heroSSIdleFrameCount: number;
  private heroSSFrameTotalCount: number;
  private heroSSIdleLeftRow: number;
  private heroSSIdleRightRow: number;
  private heroSSWalkingLeftRow: number;
  private heroSSWalkingRightRow: number;

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
    
    // TODO: REMOVE THIS LINE
    this.raceId = 4;

    console.log('INIT: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    console.log('INIT: this.raceId: ' + this.raceId);

    this.context = context;
    this.viewport = viewport;
    this.heroImage = new Image();
    
    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    this.getHeroSpriteSheetAttributesBasedOnRace();

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
    this.orientation = 'right';
    this.level = level;
    console.log('INIT: position: ' + this.position);
  };

  getHeroSpriteSheetAttributesBasedOnRace() { 
    switch (this.raceId) {
      case 1: // halfling
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-halfling-female.png';
        this.heroSSFrameTotalCount = 9;
        this.heroSSIdleFrameCount = 6;
        this.heroSSIdleLeftRow = 7;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 8;
        this.heroSSWalkingRightRow = 1;
        break;
      case 2: // elf
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-elf-female.png';
        this.heroSSFrameTotalCount = 8;
        this.heroSSIdleFrameCount = 4;
        this.heroSSIdleLeftRow = 5;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 6;
        this.heroSSWalkingRightRow = 1;
        break;
      case 3: // human
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-human-male.png';
        this.heroSSFrameTotalCount = 8;
        this.heroSSIdleFrameCount = 4;
        this.heroSSIdleLeftRow = 5;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 6;
        this.heroSSWalkingRightRow = 1;
        break;
      case 4: // dwarf
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-dwarf-male.png';
        this.heroSSFrameTotalCount = 8;
        this.heroSSIdleFrameCount = 8;
        this.heroSSIdleLeftRow = 7;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 8;
        this.heroSSWalkingRightRow = 1;
        break;
      case 5: // troll
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-troll-male.png';
        this.heroSSFrameTotalCount = 8;
        this.heroSSIdleFrameCount = 4;
        this.heroSSIdleLeftRow = 8;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 10;
        this.heroSSWalkingRightRow = 2;
        break;
      case 6: // vampire
        this.heroImage.src = '../assets/graphics/postacie/' + 'dl-characters-vampire-male.png';
        this.heroSSFrameTotalCount = 12;
        this.heroSSIdleFrameCount = 10;
        this.heroSSIdleLeftRow = 7;
        this.heroSSIdleRightRow = 0;
        this.heroSSWalkingLeftRow = 8;
        this.heroSSWalkingRightRow = 1;
        break;
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

  setOrientation(orientation){
    this.orientation = orientation;
  }

  go(direction){

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
        this.setOrientation('right');
        break;
      case 'left':
        this.coord_x--;
        this.direction='left';
        this.setOrientation('left');
        break;
      case 'top-left':
        this.coord_x--;
        this.coord_y--;
        this.direction='left';
        this.setOrientation('left');
        break;
      case 'bottom-left':
        this.coord_x--;
        this.coord_y++;
        this.direction='left';
        this.setOrientation('left');
        break;
      case 'top-right':
        this.coord_x++;
        this.coord_y--;
        this.direction='right';
        this.setOrientation('right');
        break;
      case 'bottom-right':
        this.coord_x++;
        this.coord_y++;
        this.direction='right';
        this.setOrientation('right');
        break;
              
    }

    this.position = this.coord_x + this.coord_y * this.world.columns;
    console.log('after move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    console.log('after move: position: ' + this.position);
  }

  stop(){
    if (this.direction!=null)
    {
      this.direction=null;
      //console.log('stop');
    }
  }

  drawHero(currentFrameTime){

    /* This bit of code gets the players's position in the world in terms of
       columns and rows and converts it to an index in the map array */
       // let this_index =
       //   Math.floor((this.pixel_y + this.scaledSize * 0.5) / this.scaledSize) * columns
       //   + Math.floor((this.pixel_x + this.scaledSize * 0.5) / this.scaledSize); // ????
   
       let sheetOffsetX = 0;
       let sheetOffsetY = 0;
   
       const milisec = currentFrameTime % 1000;
       //const currentFrame = Math.floor(milisec / 130) + 1;
       let currentFrame = Math.floor(milisec / 125);

       sheetOffsetX = currentFrame * this.sizeX;

       switch(this.direction)
       {
          case 'up':
          case 'down':
            if(this.orientation == 'right') {
              sheetOffsetY = this.heroSSWalkingRightRow * this.sizeY;
            } else {
              sheetOffsetY = this.heroSSWalkingLeftRow * this.sizeY;
              sheetOffsetX = (this.heroSSFrameTotalCount - 1 - currentFrame) * this.sizeX;
            }
            break;
          case 'right':
            sheetOffsetY = this.heroSSWalkingRightRow * this.sizeY;
            break;
          case 'left':
            sheetOffsetY = this.heroSSWalkingLeftRow * this.sizeY; // 1 * this.sizeX;
            sheetOffsetX = (this.heroSSFrameTotalCount - 1 - currentFrame) * this.sizeX;
            break;
          default:
            currentFrame = Math.floor(milisec / Math.round(1000 / this.heroSSIdleFrameCount));

            sheetOffsetX = currentFrame * this.sizeX;
            if (this.orientation == 'right')
            {
              sheetOffsetY = this.heroSSIdleRightRow * this.sizeY;
            } else {
              sheetOffsetX = (this.heroSSFrameTotalCount - 1 - currentFrame) * this.sizeX;
              sheetOffsetY = this.heroSSIdleLeftRow * this.sizeY;
            }
            break;
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
