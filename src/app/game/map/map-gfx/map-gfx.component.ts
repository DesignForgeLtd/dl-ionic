import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { MapService } from '../map.service';
import { GameUIService } from '../../game-ui.service';
import { Viewport } from '../map-scripts/viewport';
import { World } from '../map-scripts/world';
import { Player } from '../map-scripts/player';

import { MapResponseData } from 'src/app/game/shared/map-service.interfaces';


@Component({
  selector: 'app-map-gfx',
  templateUrl: './map-gfx.component.html',
  styleUrls: ['./map-gfx.component.scss']
})
export class MapGfxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  tileSheet: HTMLImageElement;
  viewport: Viewport;


  monsters: any;


  scaledSize = 76;
  spriteSize = 76;

  playerSize = 32;
  playerScaledSize = 32;

  columns: number = 200;// columns and rows in map below
  rows: number = 200;
  
  pointer = { x:100, y:100 };// The adjusted mouse position
  
  height: number;
  width: number;


  @Input() playerSubject: Subject<Player>;
  player: Player;
  
  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService,
    protected world: World
  ) {
    this.tileSheet = new Image();

  }


  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');

    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;


    //this.tileSheet.addEventListener('load', (event) => { this.loop(); });

    //let viewport = new Viewport(0, 0, (gamemap_size_x*spriteSize), (gamemap_size_y*spriteSize));
    this.viewport = new Viewport(0, 0, this.width, this.height);
    
    this.tileSheet.src = 'assets/graphics/terrain/mapa_plachta.jpg';

    this.loadMonsters();
   
    this.playerSubject.subscribe(v => { 
      console.log('PLAYER', v);
      this.player = v;
    });

    this.addCanvasClickListener();
  }  
  
  ngAfterViewInit() {

  }
  
  ngOnDestroy(): void {
    console.log('MapGfx component destroyed');
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
      //console.log('result', result);
      if (result !== true && result !== false)
      {
        this.gameUIService.showError(result);
      }

    });
  }

  

  gfxLoop(currentFrameTime){
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    /* Resize canvas on every frame */
    this.context.canvas.height = this.height;
    this.context.canvas.width  = this.width;
    // this.context.imageSmoothingEnabled = false;// prevent antialiasing of drawn image

    this.viewport.scrollTo(this.player.pixel_x, this.player.pixel_y);

    this.drawTerrain();

    /* Draw the this.player. Remember to offset by the viewport position and
       center screen position. (???) */
    this.drawHero(currentFrameTime);    
    //console.log('map-gfx: ' + Date.now());
    
  //   // console.log('this.player.pixel_x, this.player.pixel_y: ' + this.player.pixel_x, this.player.pixel_y);
   
     this.infolocationUpdate();
  }


  // handleFoundMonster(foundMonster){
  //   if (foundMonster === null) {
  //     return;
  //   }

  //   if (foundMonster.alive){
  //     console.log('MONSTER ZYJE!!!');
  //   }
  // }


  infolocationUpdate(){
    document.getElementById('location-info').innerHTML =
      this.world.locationInfo(this.player.coord_x + this.player.coord_y * this.columns)
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
// console.log('this.viewport.x, this.viewport.w: ' + this.viewport.x, this.viewport.w);
// console.log('this.viewport.y, this.viewport.h: ' + this.viewport.y, this.viewport.h);
// console.log('this.columns: ' + this.columns);
// console.log('this.rows: ' + this.rows);
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
// console.log('poleLinkOpis: ');
// console.log(poleLinkOpis);
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

  drawHero(currentFrameTime){

    var varsToDraw = this.player.getVarsToDrawHero(currentFrameTime);

    this.context.drawImage(
        varsToDraw.heroImage,
        varsToDraw.sheetOffsetX,
        varsToDraw.sheetOffsetY,
        varsToDraw.sizeX,
        varsToDraw.sizeY,
        Math.round(varsToDraw.pixel_x - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5),
        Math.round(varsToDraw.pixel_y - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5),
        varsToDraw.scaledSizeX,
        varsToDraw.scaledSizeY
    );
  }

  drawOtherHero(currentFrameTime){

    // var varsToDraw = this.otherHero.getVarsToDrawHero(currentFrameTime);

    // this.context.drawImage(
    //     varsToDraw.heroImage,
    //     varsToDraw.sheetOffsetX,
    //     varsToDraw.sheetOffsetY,
    //     varsToDraw.sizeX,
    //     varsToDraw.sizeY,
    //     Math.round(varsToDraw.pixel_x - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5),
    //     Math.round(varsToDraw.pixel_y - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5),
    //     varsToDraw.scaledSizeX,
    //     varsToDraw.scaledSizeY
    // );
  }


}
