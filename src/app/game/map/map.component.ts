import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

import { Player } from './map-scripts/Player';
import { World } from './map-scripts/World';
import { MapService } from './map.service';
import { GameUIService } from '../game-ui.service';
import { Hero } from './map-scripts/Hero';
import { MapGfxComponent } from './map-gfx/map-gfx.component';

// interface MonstersData{
//   positions: any;
//   alive: any;
// }

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @Output() foundLocation : EventEmitter<any> = new EventEmitter();
  @ViewChild(MapGfxComponent, {static : true}) mapGfx : MapGfxComponent;

  //TODO: see which properties can be deleted
  scaledSize = 76;
  spriteSize = 76;

  playerSize = 32;
  playerScaledSize = 32;


  columns: number = 200;// columns and rows in map below
  rows: number = 200;

  monsters: any;

  openedModal = null;

  strollEventFind = [];
  strollEventInterval = null;
  strollEventFight = null;

    // // TODO: remove ???
    heroImage: HTMLImageElement;

  serverSavedNewPosition = true;
  playerSavedPosition: number;

  lastFrameRenderTime;
  lastFrameTime;

  animationFrame;

  frameCounter: number;
  previousSecond: number;

  visibleHeroes: Hero[];

  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService,
    protected world: World,
    protected player: Player
  ) {
    this.heroImage = new Image();
    this.visibleHeroes = new Array<Hero>;

    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
  }

  ngOnInit(): void {
    console.log('Map component initialized');

    this.columns = this.world.columns;
    this.rows = this.world.rows;

    this.lastFrameTime = Date.now();
    this.loadHeroEssentialData();

    this.frameCounter = 0;
    this.previousSecond = Math.floor(Date.now() / 1000);

  }

  getVisibleHeroByID(id: number)
  {

  }

  loadHeroEssentialData() {
    this.mapService.loadHeroEssentialData()
      .subscribe(data => {

        const playerData = data.playerData;

        this.world.setLevel(playerData.level);

        const originalPosition = playerData.position;
        if (playerData.occupied_with === 'mining') {
          playerData.position = playerData.positionInMine;
        }

        //this.player = new Player(
        this.player.setPlayerData(
          playerData.id,
          playerData.position % this.columns,
          Math.floor(playerData.position / this.columns),
          playerData.level,
          playerData.race_id
        );

        this.mapService.loadGameMap(playerData.level, playerData.position);

        this.gameUIService.heroInfoInitialize(playerData);

        this.foundLocation.emit({
          'foundLocation': data.foundLocation,
          'foundMonster': data.foundMonster
        });
        
        this.handleFoundQuest(data.foundQuest);

        this.loadOtherHeroes();

        this.animationFrame = window.requestAnimationFrame(() => this.loop());
      });
  }

  loadOtherHeroes()
  {
    let otherHero = new Hero(
      66,
      2, 
      this.player.hero.coord_x - 2,
      this.player.hero.coord_y
    );

    this.visibleHeroes.push(otherHero);
    
    otherHero = new Hero(
      11,
      3, 
      this.player.hero.coord_x + 2,
      this.player.hero.coord_y + 3
    );

    this.visibleHeroes.push(otherHero);
  }


  /*
    The game loop
  */
  loop() {
    this.animationFrame = window.requestAnimationFrame(() => this.loop());

    //this.frameTimeDebug();

    this.heroLoop();
    this.mapGfx.gfxLoop(this.visibleHeroes);

    this.infolocationUpdate();
  }

  heroLoop() {
    //console.log('map: ' + Date.now());
    // if animation of the current step complete
    if (this.player.hero.coord_x * this.scaledSize === this.player.hero.pixel_x
      && this.player.hero.coord_y * this.scaledSize === this.player.hero.pixel_y) {
      if (this.serverSavedNewPosition === true) {
        if (this.player.hero.hero_path != null) {
          this.lastFrameRenderTime = Date.now() - this.lastFrameTime;
          this.lastFrameTime = Date.now();
          console.log('Last frame render time: ' + this.lastFrameRenderTime);

          this.tryHeroNextStep();
        }
        else {
          // or make hero stand still
          this.player.hero.stop();
        }
      }
      else {
        console.log('Hero stuck due to serverSavedNewPosition === false');
        // TODO: after 5s (?) of API not responding, player.revertHeroLastStep()
        // keep in mind, hero might simply not be moving (no lag)... do not revert then
      }
    }
    else {
      this.player.hero.animate();
    }
  }

  tryHeroNextStep() {
    // proceed with next step
    this.setServerSavedNewPositionToFalse();
    this.player.hero.moveHeroStep();
    this.player.hero.animate();
    this.updateHeroPosition();
  }

  updateHeroPosition() {
    // send info about player's new coords to the server
    this.playerSavedPosition = this.player.hero.position;
    this.mapService.updateActualPosition(this.playerSavedPosition).subscribe(data => {
      this.setServerSavedNewPosition();
      if (data.success === true) {
        this.processMapResponse(data);
      }
      else {
        this.gameUIService.showError(data.errorMessage);
        console.log('HERE');
        this.player.hero.revertHeroLastStep();
        this.player.hero.stop();
      }

      this.gameUIService.heroInfoInitialize(data.playerData);
    });
  }

  processMapResponse(data) {
    if (data.foundMonster !== null && data.foundMonster.alive === true) {
      console.log('Monster is alive!!!');
      this.player.hero.revertHeroLastStep();
    } else {
      this.player.hero.incrementHeroStep();
    }

    this.foundLocation.emit({
      'foundLocation': data.foundLocation,
      'foundMonster': data.foundMonster
    });

    this.handleFoundQuest(data.foundQuest);

    if (data.strollEvent !== null) {
      if (data.strollEvent.type === 'find') {
        if (this.strollEventInterval) {
          clearInterval(this.strollEventInterval);
        }
        this.strollEventFind.push(data.strollEvent.data);
        this.strollEventInterval = setInterval(() => {
          this.strollEventFind = [];
          clearInterval(this.strollEventInterval);
        }, 2222);
      }

      // TODO: remove 'false &&' to enable fight stroll
      if (false && data.strollEvent.type === 'fight') {
        this.openedModal = 'fight';
        this.strollEventFight = data.strollEvent.data;
        this.player.hero.clearMovementParams();
        this.player.hero.stop();
      }
    }
  }T


  setServerSavedNewPosition() {
    this.serverSavedNewPosition = true;
    console.log('this.serverSavedNewPosition = true;');
  }

  setServerSavedNewPositionToFalse() {
    this.serverSavedNewPosition = false;
    console.log('this.serverSavedNewPosition = false;');
  }

  handleFoundQuest(foundQuest: boolean) {
    this.gameUIService.showQuestIcon(foundQuest);
    // console.log('found Quest is: ');
    // console.log(foundQuest);
  }

  frameTimeDebug()
  {
    const currentSecond = Math.floor(Date.now() / 1000);
    this.frameCounter++;

    if (this.previousSecond != currentSecond)
    {
      //console.log("Last second ("+this.previousSecond+")frame count:" + this.frameCounter);
      this.previousSecond = currentSecond;
      this.frameCounter = 0;
    }
  }

  infolocationUpdate(){
    document.getElementById('location-info').innerHTML =
      this.world.locationInfo(this.player.hero.coord_x + this.player.hero.coord_y * this.columns)
      + ' ('+this.player.hero.coord_x+','+this.player.hero.coord_y+')';
  }

  closeModal() {
    this.gameUIService.openedModal.emit(null);
  }

  ngOnDestroy(): void {
    console.log('Map component destroyed');
    cancelAnimationFrame(this.animationFrame);
  }
}
