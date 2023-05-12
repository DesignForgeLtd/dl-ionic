/* eslint-disable @typescript-eslint/naming-convention */

import { HeroSprite } from './HeroSprite';

export class Hero {
  
  public pixel_x: number;
  public pixel_y: number;

  public direction: string;
  public orientation: string; // where is hero facing (left OR right)

  private heroSprite: HeroSprite;

  public msToMoveOneSquare = 500; // TODO: make private and create accessor

  private pixelsLeftInCurrentStepAnimation = 76;
  private estimatedPositionChangesLeft = 30;

  lastFrameRenderDuration;
  lastFrameRenderTime = 0;
  framesRenderedInStep = 0;
  averageFrameRenderDuration;
  totalRenderDuration = 0;

  world_columns = 200;

  scaled_size = 76;// map tile size

  public coord_x: number;
  public coord_y: number;

  constructor(
    raceId: number,
    coord_x: number, 
    coord_y: number
  ) {
    this.direction = null;
    this.orientation = 'right';

    this.coord_x = coord_x; 
    this.coord_y = coord_y;

    this.pixel_x = this.coord_x * this.scaled_size; // pixels
    this.pixel_y = this.coord_y * this.scaled_size;

    this.heroSprite = new HeroSprite(raceId, this.scaled_size);
  };

  setOrientation(orientation){
    this.orientation = orientation;
  }

  clearHeroAnimationParams()
  {
    this.pixelsLeftInCurrentStepAnimation = 76;
    this.lastFrameRenderTime = 0;
    this.totalRenderDuration = 0;
    this.framesRenderedInStep = 0;
  }

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
    if (animationSpeed <= 0)
    {
      animationSpeed = 1;
    }
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

}
