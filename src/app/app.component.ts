/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Player } from './player';
import { Viewport } from './viewport';
import { World } from './world';


@Component({
  selector: 'app-root',
  template: `
    <canvas #canvas></canvas>
  `,
  styles: ['canvas { border: none }']
})
export class AppComponent implements OnInit {
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
  player_x = 36;
  player_y = 69;

  height: number;
  width: number;

  pointer = { x:100, y:100 };// The adjusted mouse position

  player: Player;
  viewport: Viewport;
  world: World;

  tile_sheet: any;
  hero_image: any;

  private context: CanvasRenderingContext2D;

  constructor(private http: HttpClient) {
    this.tile_sheet = new Image();
    this.hero_image = new Image();
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');

    /* The width and height of the inside of the browser window */
    this.height = document.documentElement.clientHeight;
    this.width  = document.documentElement.clientWidth;

    //this.monsters = loadMonsters();

    this.world = new World();
    this.http.get(
      'assets/detailedMap1.txt',
      {responseType: 'text'}
    )
    .subscribe(data => {
        this.world.populateMap(data);
    });

    this.player = new Player(this.player_x, this.player_y, this.world, this.scaledSize);
    //let viewport = new Viewport(0, 0, (gamemap_size_x*spriteSize), (gamemap_size_y*spriteSize));
    this.viewport = new Viewport(0, 0, this.width, this.height);


    this.tile_sheet.addEventListener('load', (event) => { this.loop(); });
    this.tile_sheet.src = 'assets/graphics/terrain/mapa_plachta.jpg';
    this.hero_image.src = 'assets/graphics/postacie/professor_walk_cycle_no_hat.png';

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

      this.player.moveHero(
        Math.floor(this.pointer.x / this.scaledSize),
        Math.floor(this.pointer.y / this.scaledSize)
      );

    });
  }

  loop() {// The game loop

    window.requestAnimationFrame(() => this.loop());

    const currentFrameTime = Date.now();

    this.height = document.documentElement.clientHeight; // HERE
    this.width  = document.documentElement.clientWidth; // HERE

    /* Resize canvas on every frame */
    this.context.canvas.height = this.height;
    this.context.canvas.width  = this.width;

//          this.context.imageSmoothingEnabled = false;// prevent antialiasing of drawn image
//console.log([hero_path, player.pos_x, scaledSize, player.pos_x * scaledSize,  player.x, player.pos_x * scaledSize == player.x]);


    // when movement stops for the current step
    // TODO:
    if (this.player.pos_x * this.scaledSize === this.player.x
      && this.player.pos_y * this.scaledSize === this.player.y)
    {
      if (this.player.hero_path != null)
      {
        // proceed with next step
        this.player.moveHeroStep();
      }
      else
      {
        // or make hero stand still
        this.player.stop();
      }
    }


    this.player.repositionTo(this.player.pos_x, this.player.pos_y);
    //player.moveTo(pointer.x, pointer.y);
    this.viewport.scrollTo(this.player.x, this.player.y);

    /* Get the min and max column and row in the map to draw. For the min
    column and row (x and y) we use floor to round down and for the max we
    use ceil to round up. We want to get the rows and columns under the borders
    of the viewport rectangle. This is visualized by the white square in the example. */
    //console.log(this.player);
    let x_min = Math.floor(this.viewport.x / this.scaledSize);
    let y_min = Math.floor(this.viewport.y / this.scaledSize);
    let x_max = Math.ceil((this.viewport.x + this.viewport.w) / this.scaledSize);
    let y_max = Math.ceil((this.viewport.y + this.viewport.h) / this.scaledSize);

    /* the min and max column and row values cannot go beyond the boundaries
    of the map. Those values are 0 and the number of columns and rows in the map. */
    if (x_min < 0) { x_min = 0; }
    if (y_min < 0) { y_min = 0; }
    if (x_max > this.columns) { x_max = this.columns; }
    if (y_max > this.rows) { y_max = this.rows; }

    /* Now we loop through the tiles in the map, but only between the min
    and max columns and rows that the this.viewport is over. To do this we use two
    for loops, one for the columns (x) and one for the rows (y) of the map. */
    for (let x = x_min; x < x_max; x ++) {
      for (let y = y_min; y < y_max; y ++) {
        this.drawTileInViewport(x, y);
      }
    }

    /* This bit of code gets the this.player's position in the world in terms of
    columns and rows and converts it to an index in the map array */
    // let this.player_index =
    //   Math.floor((this.player.y + this.scaledSize * 0.5) / this.scaledSize) * columns
    //   + Math.floor((this.player.x + this.scaledSize * 0.5) / this.scaledSize);

    /* If the this.player is standing on a grass tile, make it a short grass tile */
    // if (pole[this.player_index] == 2) pole[this.player_index] = 1;

    /* Draw the this.player. Remember to offset by the viewport position and
    center screen position. */
    this.drawHero(currentFrameTime);


    /* Draw the viewport rectangle. */
    this.context.strokeStyle = '#ffffff';
    this.context.rect(
      this.width * 0.5 - this.viewport.w * 0.5,
      this.height * 0.5 - this.viewport.h * 0.5,
      this.viewport.w,
      this.viewport.h
    );
    this.context.stroke();
  }

  drawTileInViewport(x, y){
    //let value = pole[y * columns + x];// Tile value

    const ppp = x + y * this.columns;

    const poleLinkOpis = this.world.rysujPole(ppp*3).split('|||');

    const plo0 = poleLinkOpis[0];
    const bckpoz = plo0.split('|');
    // if (bckpoz[1] != '0') bpx = '-'+bckpoz[1]+'px'; else bpx = '0';
    // if (bckpoz[0] != '0') bpy = '-'+bckpoz[0]+'px'; else bpy = '0';

     //console.log("x= "+x+", y= "+y+", ppp= "+ppp+", poleLinkOpis= "+poleLinkOpis);
     // x= 12, y= 6, ppp= 1212, poleLinkOpis= 490|294|1,woda

    // Tile x destination for drawing
    const tile_x = Math.floor(x * this.scaledSize - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5);
    // Tile y destination for
    const tile_y = Math.floor(y * this.scaledSize - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5);

    // let tile_x = Math.floor(x * this.scaledSize) - viewport.x;
    // let tile_y = Math.floor(y * this.scaledSize) - viewport.y;

    // Draw tile from tile_sheet
    this.context.drawImage(
      this.tile_sheet,
      parseInt(bckpoz[1], 10),
      parseInt(bckpoz[0], 10),
      this.spriteSize,
      this.spriteSize,
      tile_x,
      tile_y,
      this.scaledSize,
      this.scaledSize
    );

    // console.log([parseInt(bckpoz[1], 10),
    // parseInt(bckpoz[0], 10),
    // this.spriteSize,
    // this.spriteSize,
    // tile_x,
    // tile_y,
    // this.scaledSize,
    // this.scaledSize]);
  }

  drawHero(currentFrameTime){

    // eslint-disable-next-line no-var
    var sheet_offset_x = 0;
    // eslint-disable-next-line no-var
    var sheet_offset_y = 0;

    const milisec = currentFrameTime % 1000;
    const currentFrame = Math.floor(milisec / 130) + 1;

    switch(this.player.direction)
    {
      case 'up':
          sheet_offset_y = 0;
          sheet_offset_x = currentFrame * this.playerScaledSize;
        break;
      case 'down':
          sheet_offset_y = 2 * this.playerScaledSize;
          sheet_offset_x = currentFrame * this.playerScaledSize;
        break;
      case 'right':
          sheet_offset_y = 3 * this.playerScaledSize;
          sheet_offset_x = currentFrame * this.playerScaledSize;
        break;
      case 'left':
          sheet_offset_y = 1 * this.playerScaledSize;
          sheet_offset_x = currentFrame * this.playerScaledSize;
        break;
      default:
          switch(this.player.prev_direction)
          {
            case 'up':
                sheet_offset_y = 0;
              break;
            case 'down':
                sheet_offset_y = 2 * this.playerScaledSize;
              break;
            case 'right':
                sheet_offset_y = 3 * this.playerScaledSize;
              break;
            case 'left':
                sheet_offset_y = 1 * this.playerScaledSize;
              break;
          }
          sheet_offset_x = 0;
    }


    this.context.drawImage(
      this.hero_image,
      sheet_offset_x,
      sheet_offset_y,
      this.playerSize,
      this.playerSize,
      Math.round(this.player.x - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5),
      Math.round(this.player.y - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5),
      this.playerScaledSize,
      this.playerScaledSize
    );
  }
}
