import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { GameUIService } from '../game-ui.service';


import { Player } from '../map/map-scripts/player';
import { Viewport } from '../map/map-scripts/viewport';
import { World } from '../map/map-scripts/world';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss'],
})
export class MiningComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;


  scaledSize = 76;
  spriteSize = 76;

  playerSize = 64;
  playerScaledSize = 64;

  columns   = 50;// columns and rows in map below
  rows      = 10;

  // from session
  gamemapSize = '17x11';
  kraina = 1;

  height: number;
  width: number;

  playerSavedPosition: number;

  pointer = { x:100, y:100 };// The adjusted mouse position

  player: Player;
  viewport: Viewport;
  world: World;

  openedModal = null;
  locationData = null;
  locationFullData = null;
  monsterData = null;

  tileSheet: HTMLImageElement;
  heroImage: HTMLImageElement;

  monsters: any;

  private context: CanvasRenderingContext2D;

  private animationFrame;
  private serverSavedNewPosition = true;



  constructor(
    private http: HttpClient,
    private mapService: MapService,
    private gameUIService: GameUIService
  ) {
    this.tileSheet = new Image();
    this.heroImage = new Image();

    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
  }

  ngOnInit(): void {
    console.log('Map component initialized');
    this.context = this.canvas.nativeElement.getContext('2d');

    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    this.tileSheet.src = 'assets/graphics/terrain/mapa_plachta.jpg';
    this.heroImage.src = '../assets/graphics/postacie/professor_walk_cycle_no_hat.png';
    this.viewport = new Viewport(0, 0, this.width, this.height);
    this.loadHeroEssentialData();

    this.addCanvasClickListener();
  }

  ngOnDestroy(): void {
    console.log('Map component destroyed');
    cancelAnimationFrame(this.animationFrame);
  }

  loadGameMap(level: number){
    let data = '';
    for (let y=0; y<this.rows; y++){
      for (let x=0; x<this.columns; x++){
        if (y === 0 && x === 0){
          data += 'g16';
        } else if (y === this.rows - 1 && x === 0){
          data += 'g09';
        } else if (y === 0 && x === this.columns - 1){
          data += 'g19';
        } else if (y === this.rows - 1 && x === this.columns - 1){
          data += 'g13';
        } else if (y === 0){
          data += 'g23';
        } else if (y === this.rows - 1){
          data += 'g34';
        } else if (x === 0){
          data += 'g27';
        } else if (x === this.columns - 1){
          data += 'g31';
        } else {
          data += 'p70';
        }
      }
    }

    this.world.populateMap(data);
  }

  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      console.log('Loaded: ');
      console.log(data);

      const playerData = data.playerData;

      this.world = new World(playerData.level);
      playerData.position = 1001;
      this.player = new Player(
        playerData.position % 200,
        Math.floor(playerData.position / 200),
        playerData.level,
        this.world,
        this.scaledSize
      );
      this.playerSavedPosition = this.player.position;
      this.loadGameMap(this.player.level);
      this.heroInfoUpdate(playerData);
      // this.loop();
      this.animationFrame = window.requestAnimationFrame(() => this.loop());
    });
  }

  addCanvasClickListener(){
    this.context.canvas.addEventListener('click', (event) => {

      this.pointer.x =
        event.pageX
        + this.viewport.x
        - this.width * 0.5
        + this.viewport.w * 0.5;
      this.pointer.y =
        event.pageY
        + this.viewport.y
        - this.height * 0.5
        + this.viewport.h * 0.5;

      const result = this.player.moveHero(
        Math.floor(this.pointer.x / this.scaledSize),
        Math.floor(this.pointer.y / this.scaledSize)
      );

      if (result !== true && result !== false)
      {
        this.showError(result);
      }

    });
  }

  loop() {// The game loop

    this.animationFrame = window.requestAnimationFrame(() => this.loop());
    const currentFrameTime = Date.now();

    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    /* Resize canvas on every frame */
    this.context.canvas.height = this.height;
    this.context.canvas.width  = this.width;
    // this.context.imageSmoothingEnabled = false;// prevent antialiasing of drawn image

    this.heroLoop();
    this.viewport.scrollTo(this.player.pixel_x, this.player.pixel_y);

    this.drawTerrain();
    this.drawHero(currentFrameTime);
    this.infolocationUpdate();
  }

  heroLoop(){
    // if animation of the current step complete
    if (this.player.coord_x * this.scaledSize === this.player.pixel_x
      && this.player.coord_y * this.scaledSize === this.player.pixel_y)
    {
      if (this.serverSavedNewPosition === true){
        this.tryHeroNextStep();
      }
      else{
        console.log('Hero stuck due to serverSavedNewPosition === false');
        // TODO: after 5s (?) of API not responding, player.revertHeroLastStep()
        // keep in mind, hero might simply not be moving (no lag)... do not revert then
      }
    }
    else
    {
      this.player.animate();
    }
  }

  tryHeroNextStep(){
    if (this.player.hero_path != null)
    {
      // proceed with next step
      //this.setServerSavedNewPositionToFalse();
      this.player.moveHeroStep();
      this.player.animate();
      //this.updateHeroPosition();
      this.player.incrementHeroStep();
    }
    else
    {
      // or make hero stand still
      this.player.stop();
    }
  }

  updateHeroPosition(){
    // send info about player's new coords to the server

      this.playerSavedPosition = this.player.position;
      this.mapService.updateActualPosition(this.playerSavedPosition).subscribe(data => {
        this.setServerSavedNewPosition();
        if (data.success === true){
            this.player.incrementHeroStep();
        }
        else {
          this.showError(data.errorMessage);
          console.log('HERE');
          this.player.revertHeroLastStep();
          this.player.stop();
        }

        this.heroInfoUpdate(data.playerData);
      });
  }

  setServerSavedNewPosition(){
    this.serverSavedNewPosition = true;
    //console.log('this.serverSavedNewPosition = true;');
  }

  setServerSavedNewPositionToFalse(){
    this.serverSavedNewPosition = false;
    //console.log('this.serverSavedNewPosition = false;');
  }

  infolocationUpdate(){
    document.getElementById('location-info').innerHTML =
      this.world.locationInfo(this.player.coord_x + this.player.coord_y * 200)
      + ' ('+this.player.coord_x+','+this.player.coord_y+')';
  }

  heroInfoUpdate(heroInfo){
    this.gameUIService.heroInfoInitialize(heroInfo);
  }

  drawTerrain(){
    let xMin = Math.floor(this.viewport.x / this.scaledSize);
    let yMin = Math.floor(this.viewport.y / this.scaledSize);
    let xMax = Math.ceil((this.viewport.x + this.viewport.w) / this.scaledSize);
    let yMax = Math.ceil((this.viewport.y + this.viewport.h) / this.scaledSize);

    if (xMin < 0) { xMin = 0; }
    if (yMin < 0) { yMin = 0; }
    if (xMax > this.columns) { xMax = this.columns; }
    if (yMax > this.rows) { yMax = this.rows; }

    for (let x = xMin; x < xMax; x ++) {
      for (let y = yMin; y < yMax; y ++) {
        this.drawTileInViewport(x, y);
      }
    }
  }

  drawTileInViewport(x, y){
    const ppp = x + y * this.columns;

    const poleLinkOpis = this.world.drawTile(ppp*3).split('|||');

    const plo0 = poleLinkOpis[0];
    const bckpoz = plo0.split('|');

    // Tile x destination for drawing
    const tileX = Math.floor(x * this.scaledSize - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5);
    // Tile y destination for
    const tileY = Math.floor(y * this.scaledSize - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5);

    // Draw tile from tileSheet
    this.context.drawImage(
      this.tileSheet,
      parseInt(bckpoz[1], 10),
      parseInt(bckpoz[0], 10),
      this.spriteSize,
      this.spriteSize,
      tileX,
      tileY,
      this.scaledSize,
      this.scaledSize
    );
  }

  /* Draw the this.player. Remember to offset by the viewport position and
    center screen position. (???) */
  drawHero(currentFrameTime){

  /* This bit of code gets the this.player's position in the world in terms of
    columns and rows and converts it to an index in the map array */
    // let this.player_index =
    //   Math.floor((this.player.pixel_y + this.scaledSize * 0.5) / this.scaledSize) * columns
    //   + Math.floor((this.player.pixel_x + this.scaledSize * 0.5) / this.scaledSize); // ????

    let sheetOffsetX = 0;
    let sheetOffsetY = 0;

    const milisec = currentFrameTime % 1000;
    const currentFrame = Math.floor(milisec / 130) + 1;

    switch(this.player.direction)
    {
      case 'up':
          sheetOffsetY = 0;
          sheetOffsetX = currentFrame * this.playerScaledSize;
        break;
      case 'down':
          sheetOffsetY = 2 * this.playerScaledSize;
          sheetOffsetX = currentFrame * this.playerScaledSize;
        break;
      case 'right':
          sheetOffsetY = 3 * this.playerScaledSize;
          sheetOffsetX = currentFrame * this.playerScaledSize;
        break;
      case 'left':
          sheetOffsetY = 1 * this.playerScaledSize;
          sheetOffsetX = currentFrame * this.playerScaledSize;
        break;
      default:
          switch(this.player.prev_direction)
          {
            case 'up':
                sheetOffsetY = 0;
              break;
            case 'down':
                sheetOffsetY = 2 * this.playerScaledSize;
              break;
            case 'right':
                sheetOffsetY = 3 * this.playerScaledSize;
              break;
            case 'left':
                sheetOffsetY = 1 * this.playerScaledSize;
              break;
          }
          sheetOffsetX = 0;
    }


    this.context.drawImage(
      this.heroImage,
      sheetOffsetX,
      sheetOffsetY,
      this.playerSize,
      this.playerSize,
      Math.round(this.player.pixel_x - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5),
      Math.round(this.player.pixel_y - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5),
      this.playerScaledSize,
      this.playerScaledSize
    );
  }

  showError(errorMessage){
    document.getElementById('error-info').innerHTML = errorMessage;
    document.getElementById('error-info').style.display = 'block';

    setTimeout(() => document.getElementById('error-info').style.display = 'none', 3000);
  }



  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }
}
