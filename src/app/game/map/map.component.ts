import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';


import { Player } from './map-scripts/player';
import { Viewport } from './map-scripts/viewport';
import { World } from './map-scripts/world';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;


  scaledSize = 76;
  spriteSize = 76;

  playerSize = 64;
  playerScaledSize = 64;

  columns   = 200;// columns and rows in map below
  rows      = 200;

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

  tileSheet: HTMLImageElement;
  heroImage: HTMLImageElement;

  private context: CanvasRenderingContext2D;

  private animationFrame;
  private serverSavedNewPosition = true;

  constructor(
    private http: HttpClient,
    private mapService: MapService
  ) {
    this.tileSheet = new Image();
    this.heroImage = new Image();
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');

    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    this.tileSheet.src = 'assets/graphics/terrain/mapa_plachta.jpg';
    this.heroImage.src = '../assets/graphics/postacie/professor_walk_cycle_no_hat.png';
    //this.tileSheet.addEventListener('load', (event) => { this.loop(); });

    //let viewport = new Viewport(0, 0, (gamemap_size_x*spriteSize), (gamemap_size_y*spriteSize));
    this.viewport = new Viewport(0, 0, this.width, this.height);

    this.loadGameMap();
    this.loadPlayerData();
    //this.monsters = loadMonsters();

    this.addCanvasClickListener();
  }

  ngOnDestroy(): void {
    console.log('Map component destroyed');
    cancelAnimationFrame(this.animationFrame);
  }

  loadGameMap(){
    this.world = new World();
    this.http.get(
      'assets/detailedMap1.txt',
      {responseType: 'text'}
    )
    .subscribe(data => {
        this.world.populateMap(data);
    });
  }

  loadPlayerData(){
    this.mapService.loadPlayerData()
    .subscribe(data => {
      console.log('Loaded: ');
      console.log(data);
        this.player = new Player(data.position % 200, Math.floor(data.position / 200), this.world, this.scaledSize);
        this.playerSavedPosition = this.player.position;
        this.playerInfoUpdate(data);
        this.loop();
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
    //this.trySendApiRequest();


    this.viewport.scrollTo(this.player.pixel_x, this.player.pixel_y);

    this.drawTerrain();
    this.drawHero(currentFrameTime);
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
      //console.log('this.player.hero_path_step: '+this.player.hero_path_step);
      // proceed with next step
      this.setServerSavedNewPositionToFalse();
      this.player.moveHeroStep();
      this.player.animate();
      this.sendApiRequest();
    }
    else
    {
      // or make hero stand still
      this.player.stop();
    }
  }

  sendApiRequest(){
    // send info about player's new coords to the server

      this.playerSavedPosition = this.player.position;
      this.mapService.updateActualPosition(this.playerSavedPosition).subscribe(data => {
        if (data.success === true){
          this.setServerSavedNewPosition();
          this.player.incrementHeroStep();
        }
        else {
          this.showError(data.errorMessage);
          this.player.revertHeroLastStep();
        }

        this.playerInfoUpdate(data.playerData);
        this.infolocationUpdate();
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

  playerInfoUpdate(playerInfo){
    document.getElementById('player-info').innerHTML =
      '<b>' + playerInfo.name + '</b> (ID: ' + playerInfo.id + ')'
      + ', Energy: ' + playerInfo.energy
      + ', Stamina: ' + playerInfo.stamina
      + ', Health: ' + playerInfo.health
      + ', Position: ' + playerInfo.position + ' ('+this.player.coord_x+','+this.player.coord_y+')';
  }

  drawTerrain(){
    /* Get the min and max column and row in the map to draw. For the min
    column and row (x and y) we use floor to round down and for the max we
    use ceil to round up. We want to get the rows and columns under the borders
    of the viewport rectangle. This is visualized by the white square in the example. */
    //console.log(this.player);
    let xMin = Math.floor(this.viewport.x / this.scaledSize);
    let yMin = Math.floor(this.viewport.y / this.scaledSize);
    let xMax = Math.ceil((this.viewport.x + this.viewport.w) / this.scaledSize);
    let yMax = Math.ceil((this.viewport.y + this.viewport.h) / this.scaledSize);

    /* the min and max column and row values cannot go beyond the boundaries
    of the map. Those values are 0 and the number of columns and rows in the map. */
    if (xMin < 0) { xMin = 0; }
    if (yMin < 0) { yMin = 0; }
    if (xMax > this.columns) { xMax = this.columns; }
    if (yMax > this.rows) { yMax = this.rows; }

    /* Now we loop through the tiles in the map, but only between the min
    and max columns and rows that the this.viewport is over. To do this we use two
    for loops, one for the columns (x) and one for the rows (y) of the map. */
    for (let x = xMin; x < xMax; x ++) {
      for (let y = yMin; y < yMax; y ++) {
        this.drawTileInViewport(x, y);
      }
    }
  }

  drawTileInViewport(x, y){
    //let value = pole[y * columns + x];// Tile value

    const ppp = x + y * this.columns;

    const poleLinkOpis = this.world.drawTile(ppp*3).split('|||');

    const plo0 = poleLinkOpis[0];
    const bckpoz = plo0.split('|');
    // if (bckpoz[1] != '0') bpx = '-'+bckpoz[1]+'px'; else bpx = '0';
    // if (bckpoz[0] != '0') bpy = '-'+bckpoz[0]+'px'; else bpy = '0';

     //console.log("x= "+x+", y= "+y+", ppp= "+ppp+", poleLinkOpis= "+poleLinkOpis);
     // x= 12, y= 6, ppp= 1212, poleLinkOpis= 490|294|1,woda

    // Tile x destination for drawing
    const tileX = Math.floor(x * this.scaledSize - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5);
    // Tile y destination for
    const tileY = Math.floor(y * this.scaledSize - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5);

    // let tileX = Math.floor(x * this.scaledSize) - viewport.x;
    // let tileY = Math.floor(y * this.scaledSize) - viewport.y;

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

}
