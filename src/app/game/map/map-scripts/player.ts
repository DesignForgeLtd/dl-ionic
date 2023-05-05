/* eslint-disable @typescript-eslint/naming-convention */

import { HeroPath } from './heropath';
import { HeroSprite } from './HeroSprite';
import { World } from './world';

export class Player {
  
  public pixel_x: number;
  public pixel_y: number;

  public position: number;
  public direction: string;
  public orientation: string;

  public hero_path = null;
  public hero_path_step = 0;

  private heroSprite: HeroSprite;

  private msToMoveOneSquare = 500;

  private pixelsLeftInCurrentStepAnimation = 76;
  private estimatedPositionChangesLeft = 30;

  lastFrameRenderDuration;
  lastFrameRenderTime = 0;
  framesRenderedInStep = 0;
  averageFrameRenderDuration;
  totalRenderDuration = 0;


  constructor(
    public coord_x: number, 
    public coord_y: number, 
    public level: number, 
    public raceId: number, 
    private world: World,
    public scaled_size: number
  ) {
    
    // TODO: REMOVE THIS LINE
    this.raceId = 4;

    // console.log('INIT: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    // console.log('INIT: this.raceId: ' + this.raceId);

    this.heroSprite = new HeroSprite(this.raceId, scaled_size);

    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;
    this.position = this.coord_x + this.coord_y * this.world.columns;
    this.direction = null;
    this.orientation = 'right';
    this.level = level;
    // console.log('INIT: position: ' + this.position);
  };

  animate() {

    if (this.lastFrameRenderTime == 0){
      this.lastFrameRenderDuration = 15;
    } else {
      this.lastFrameRenderDuration = Date.now() - this.lastFrameRenderTime;
    }

    this.totalRenderDuration += this.lastFrameRenderDuration;
    this.framesRenderedInStep++;
    this.averageFrameRenderDuration = Math.round(this.totalRenderDuration / this.framesRenderedInStep);

    this.estimatedPositionChangesLeft = Math.round(
      (this.msToMoveOneSquare  - this.totalRenderDuration) 
      / this.averageFrameRenderDuration
    );

    this.lastFrameRenderTime = Date.now();
    // console.log('lastFrameRenderDuration: ' + this.lastFrameRenderDuration);
    // console.log('totalRenderDuration: ' + this.totalRenderDuration);
    // console.log('framesRenderedInStep: ' + this.framesRenderedInStep);
    // console.log('averageFrameRenderDuration: ' + this.averageFrameRenderDuration);

    const x = this.coord_x * this.scaled_size;
    const y = this.coord_y * this.scaled_size;
    let animationSpeed = Math.round(this.pixelsLeftInCurrentStepAnimation / this.estimatedPositionChangesLeft);
    // if (animationSpeed == 0)
    // {
    //   animationSpeed = 1;
    // }
  console.log("animationSpeed: "+animationSpeed);

    if (animationSpeed > this.pixelsLeftInCurrentStepAnimation)
    {
      animationSpeed = this.pixelsLeftInCurrentStepAnimation;
    }
    
    this.pixelsLeftInCurrentStepAnimation -= animationSpeed;
  //console.log("this.pixelsLeftInCurrentStepAnimation: "+this.pixelsLeftInCurrentStepAnimation);
    /* Gradually moves the player closer to x, y every time animate() is called. */
    if (x < this.pixel_x)
    {
      this.pixel_x -= animationSpeed;
    }
    else if (x > this.pixel_x)
    {
      this.pixel_x += animationSpeed;
    }
    if (y < this.pixel_y)
    {
      this.pixel_y -= animationSpeed;
    }
    else if (y > this.pixel_y)
    {
      this.pixel_y += animationSpeed;
    }

    if (this.pixelsLeftInCurrentStepAnimation == 0)
    {
      this.pixelsLeftInCurrentStepAnimation = 76;
      this.lastFrameRenderTime = 0;
      this.totalRenderDuration = 0;
      this.framesRenderedInStep = 0;

      // console.log('lastFrameRenderDuration: ' + this.lastFrameRenderDuration);
      // console.log('totalRenderDuration: ' + this.totalRenderDuration);
      // console.log('framesRenderedInStep: ' + this.framesRenderedInStep);
      // console.log('averageFrameRenderDuration: ' + this.averageFrameRenderDuration);
    }

    //console.log("X,Y (pixels): " + this.pixel_x + ',' + this.pixel_y);
    //this.pixel_x += (x - this.pixel_x - scaled_size * 0.0) * 0.05;
    //this.pixel_y += (y - this.pixel_y - scaled_size * 0.4) * 0.05;

  }

  updateCoordsAndPixels(x, y){
    this.coord_x = x;
    this.coord_y = y;
    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;
  }

  moveHero(move_x, move_y)
	{
    if (this.coord_x === move_x && this.coord_y === move_y){
      this.pixelsLeftInCurrentStepAnimation = 76;
      this.lastFrameRenderTime = 0;
      this.totalRenderDuration = 0;
      this.framesRenderedInStep = 0;
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

    this.pixelsLeftInCurrentStepAnimation = 76;
    this.lastFrameRenderTime = 0;
    this.totalRenderDuration = 0;
    this.framesRenderedInStep = 0;
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

  setOrientation(orientation){
    this.orientation = orientation;
  }

  go(direction){

    //console.log('before move: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    //console.log('go ' + direction);
    switch (direction)
    {
      case 'up':
        this.coord_y--;
        this.direction='up';
        this.msToMoveOneSquare = 500;
        break;
      case 'down':
        this.coord_y++;
        this.direction='down';
        this.msToMoveOneSquare = 500;
        break;
      case 'right':
        this.coord_x++;
        this.direction='right';
        this.setOrientation('right');
        this.msToMoveOneSquare = 500;
        break;
      case 'left':
        this.coord_x--;
        this.direction='left';
        this.setOrientation('left');
        this.msToMoveOneSquare = 500;
        break;
      case 'top-left':
        this.coord_x--;
        this.coord_y--;
        // this.direction='top-left';
        this.direction='left';
        this.setOrientation('left');
        this.msToMoveOneSquare = 700;
        break;
      case 'bottom-left':
        this.coord_x--;
        this.coord_y++;
        // this.direction='bottom-left';
        this.direction='left';
        this.setOrientation('left');
        this.msToMoveOneSquare = 700;
        break;
      case 'top-right':
        this.coord_x++;
        this.coord_y--;
        // this.direction='top-right';
        this.direction='right';
        this.setOrientation('right');
        this.msToMoveOneSquare = 700;
        break;
      case 'bottom-right':
        this.coord_x++;
        this.coord_y++;
        // this.direction='bottom-right';
        this.direction='right';
        this.setOrientation('right');
        this.msToMoveOneSquare = 700;
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
    }
  }

  getVarsToDrawHero(currentFrameTime){

    let vars = this.heroSprite.getVarsToDrawHero(
      currentFrameTime,
      this.direction,
      this.orientation
    );

    return {
      'heroImage': vars.heroImage,
      'sheetOffsetX': vars.sheetOffsetX,
      'sheetOffsetY': vars.sheetOffsetY,
      'sizeX': vars.sizeX,
      'sizeY': vars.sizeY,
      'pixel_x': this.pixel_x,
      'pixel_y': this.pixel_y,
      'scaledSizeX': vars.scaledSizeX,
      'scaledSizeY': vars.scaledSizeY
    };
  
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
}
