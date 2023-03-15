/* eslint-disable @typescript-eslint/naming-convention */

export class HeroSprite {
  
  height: number;
  width: number;

  public sizeX: number;
  public sizeY: number;
  public scaledSizeX: number;
  public scaledSizeY: number;
  public position: number;
  public scaled_size: number;
  public direction: string;
  public orientation: string;

  private heroImage: HTMLImageElement;
  private heroSSIdleFrameCount: number;
  private heroSSFrameTotalCount: number;
  private heroSSIdleLeftRow: number;
  private heroSSIdleRightRow: number;
  private heroSSWalkingLeftRow: number;
  private heroSSWalkingRightRow: number;

  constructor(
    public raceId: number, 
    scaled_size
  ) {
    
   // console.log('INIT: this.coord_x: ' + this.coord_x +', this.coord_y: ' + this.coord_y);
    console.log('INIT HeroSprite: this.raceId: ' + this.raceId);

    this.heroImage = new Image();

    this.getHeroSpriteSheetAttributesBasedOnRace();

    this.sizeX = 32;
    this.sizeY = 32;
    this.scaledSizeX = 64;
    this.scaledSizeY = 64;


    this.scaled_size = scaled_size;

    this.direction = null;
    this.orientation = 'right';
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

  getVarsToDrawHero(currentFrameTime, direction, orientation){

    this.direction = direction;
    this.orientation = orientation;

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

    return {
      'heroImage': this.heroImage,
      'sheetOffsetX': sheetOffsetX,
      'sheetOffsetY': sheetOffsetY,
      'sizeX': this.sizeX,
      'sizeY': this.sizeY,
      'scaledSizeX': this.scaledSizeX,
      'scaledSizeY': this.scaledSizeY
    };

  }

}
