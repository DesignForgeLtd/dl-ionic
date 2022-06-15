import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { GameUIService } from '../game-ui.service';


import { Player } from './map-scripts/player';
import { Viewport } from './map-scripts/viewport';
import { World } from './map-scripts/world';
import { MapService } from './map.service';

// interface MonstersData{
//   positions: any;
//   alive: any;
// }

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

  openedModal = null;
  locationData = null;
  locationFullData = null;
  monsterData = null;

  tileSheet: HTMLImageElement;
  heroImage: HTMLImageElement;

  monsters: any;

  context: CanvasRenderingContext2D;

  animationFrame;
  serverSavedNewPosition = true;



  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService
  ) {
    this.tileSheet = new Image();
    this.heroImage = new Image();
    //this.gameUIService = new GameUIService();

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
    //this.tileSheet.addEventListener('load', (event) => { this.loop(); });

    //let viewport = new Viewport(0, 0, (gamemap_size_x*spriteSize), (gamemap_size_y*spriteSize));
    this.viewport = new Viewport(0, 0, this.width, this.height);
    this.loadHeroEssentialData();
    this.loadMonsters();

    this.addCanvasClickListener();
  }

  ngOnDestroy(): void {
    console.log('Map component destroyed');
    cancelAnimationFrame(this.animationFrame);
  }

  loadGameMap(level: number){
    this.http.get(
      'assets/detailedMap'+(level+1)+'.txt',
      {responseType: 'text'}
    )
    .subscribe(data => {
        this.world.populateMap(data);
    });
  }

  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      console.log('Loaded: ');
      console.log(data);

      const playerData = data.playerData;

      this.world = new World(playerData.level);

      const positionOverwrite = this.overwriteHeroPosition();
      if (positionOverwrite !== null){
        playerData.position = positionOverwrite;
      }

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

      this.handleFoundLocation(data.foundLocation, data.foundMonster);
    });
  }

  overwriteHeroPosition(){
    return null;
  }

  // handleFoundMonster(foundMonster){
  //   if (foundMonster === null) {
  //     return;
  //   }

  //   if (foundMonster.alive){
  //     console.log('MONSTER ZYJE!!!');
  //   }
  // }

  handleFoundLocation(foundLocation, foundMonster = null){
    if (foundLocation !== null){
      switch (foundLocation.type) {
        case 2:
          console.log('found Shop Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.openLocationModal('shop');
          break;
        case 3:
          console.log('found Production Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.openLocationModal('map-production-location');
          break;
        case 4:
          console.log('found Mining Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.openLocationModal('map-location');
          break;
        case 6:
          console.log('found Monster');
          this.monsterData = foundMonster;
          this.gameUIService.openMonsterModal();
          break;
        default:
          console.log('found Other Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.openLocationModal('map-location');
      }
    }else{
      this.locationData = null;
      this.gameUIService.openLocationModal('');
    }
  }


  loadMonsters(){
    this.mapService.loadMonstersData()
    .subscribe(data => {
      this.monsters = data.monsters;
      console.log(this.monsters);
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
      this.setServerSavedNewPositionToFalse();
      this.player.moveHeroStep();
      this.player.animate();
      this.updateHeroPosition();
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

          //this.handleFoundMonster(data.foundMonster);

          if (data.foundMonster !== null && data.foundMonster.alive === true){
            console.log('Monster is alive!!!');
            this.player.revertHeroLastStep();
          } else {
            this.player.incrementHeroStep();
          }

          this.handleFoundLocation(data.foundLocation, data.foundMonster);
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

    let plo0 = poleLinkOpis[0];
    if ( poleLinkOpis[1] === 'monster'){
      plo0 = this.getMonsterImagePosition(ppp);
    }

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

  getMonsterImagePosition(ppp){
    // console.log('monster found at: ' + ppp);
    // console.log('image pos: ' + this.monsters[ppp]);
    let imagePosition = this.monsters[ppp].image;

    if (this.monsters[ppp].alive === false){
      imagePosition = '39';
    }

    if (imagePosition.includes(',')){ // for non-standard "dead picture" monsters
      imagePosition = imagePosition.split(',');
      imagePosition = imagePosition[0]; // if alive

      if (this.monsters[ppp].alive === false){
        imagePosition = imagePosition[1]; // if dead
      }
    }

    return (11 * this.scaledSize)+'|'+(imagePosition * this.scaledSize);
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

  mapLocationAction(action) {

    console.log('mapLocationAction in MapComponent:');
    console.log(action);

    switch (action.name) {
      case 'goLevelUp':
        this.useSubway('up');
        break;
      case 'goLevelDown':
        this.useSubway('down');
        break;
      case 'goToTravel':
        this.usePort(action.param);
        break;
      case 'usePortal':
        this.usePortal(action.param);
        break;
      case 'startMining':
        this.startMining(action.param);
        break;
    }
  }

  useSubway(direction: string){
    console.log('going level '+direction+'!');
    this.mapService.useUndergroundPassage(direction).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.heroInfoUpdate(data.playerData);
        this.player.level = data.playerData.level;
        this.world.setLevel(this.player.level);
        this.loadGameMap(data.playerData.level);

        this.handleFoundLocation(data.foundLocation);
      }
      else {
        this.showError(data.errorMessage);
      }

    });
  }

  usePortal(portalId: number){
    this.mapService.usePortal(portalId).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.loadHeroEssentialData();
        this.gameUIService.openLocationModal('');
      }
      else {
        this.showError(data.errorMessage);
      }

    });
  }

  usePort(portConnection: number){
    this.mapService.usePortConnection(portConnection).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.heroInfoUpdate(data.playerData);
        this.loadGameMap(data.playerData.level); // TODO: check if can be removed
        this.gameUIService.changeHeroOccupation('journey');
      }
      else {
        this.showError(data.errorMessage);
      }
    });
  }

  startMining(position: number){
    this.mapService.startMining(position).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.heroInfoUpdate(data.playerData);
        this.gameUIService.changeHeroOccupation('mining');
      }
      else {
        this.showError(data.errorMessage);
      }
    });
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }
}
