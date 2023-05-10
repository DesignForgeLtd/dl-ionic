import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

import { Player } from './map-scripts/player';
import { World } from './map-scripts/world';
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


  // player: Player;
  otherHero: Hero;

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

  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService,
    protected world: World,
    protected player: Player
  ) {
    this.heroImage = new Image();

    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
  }

  ngOnInit(): void {
    console.log('Map component initialized');

    this.lastFrameTime = Date.now();
    this.loadHeroEssentialData();

    this.frameCounter = 0;
    this.previousSecond = Math.floor(Date.now() / 1000);

    
  }

  loop() {// The game loop
    this.columns = this.world.columns;
    this.rows = this.world.rows;
    this.animationFrame = window.requestAnimationFrame(() => this.loop());
    const currentFrameTime = Date.now();

    const currentSecond = Math.floor(Date.now() / 1000);
    this.frameCounter++;

    if (this.previousSecond != currentSecond)
    {
      //console.log("Last second ("+this.previousSecond+")frame count:" + this.frameCounter);
      this.previousSecond = currentSecond;
      this.frameCounter = 0;
    }

    this.heroLoop();
    this.mapGfx.gfxLoop(currentFrameTime);
  }

  ngOnDestroy(): void {
    console.log('Map component destroyed');
    cancelAnimationFrame(this.animationFrame);
  }

  loadHeroEssentialData() {
    this.mapService.loadHeroEssentialData()
      .subscribe(data => {

        const playerData = data.playerData;
        //this.world = new World(playerData.level, this.columns, this.rows);
        //this.world = new World();

        const originalPosition = playerData.position;
        if (playerData.occupied_with === 'mining') {
          playerData.position = playerData.positionInMine;
        }

        //this.player = new Player(
        this.player.setPlayerData(
          playerData.position % this.columns,
          Math.floor(playerData.position / this.columns),
          playerData.level,
          playerData.race_id,
          this.scaledSize
        );

        this.otherHero = new Hero();
        this.otherHero.setPlayerData(
          playerData.position % this.columns + 2,
          Math.floor(playerData.position / this.columns),
          playerData.level,
          playerData.race_id,
          this.scaledSize
        );

        this.loadGameMap(this.player.level, this.player.position);


        this.heroInfoUpdate(playerData);

        //this.handleFoundLocation(data.foundLocation, data.foundMonster);
        this.foundLocation.emit(data.foundLocation);
        
        this.handleFoundQuest(data.foundQuest);

        this.animationFrame = window.requestAnimationFrame(() => this.loop());
      });
  }

  // TODO: remove duplication / make World a singleton
  loadGameMap(level: number, originalPosition: number = null) {
    this.http.get(
      'assets/detailedMap' + (level + 1) + '.txt',
      { responseType: 'text' }
    )
      .subscribe(data => {
        this.world.populateMap(data);
        console.log('MAP LOADED');
      });
  }


  setServerSavedNewPosition() {
    this.serverSavedNewPosition = true;
    console.log('this.serverSavedNewPosition = true;');
  }

  setServerSavedNewPositionToFalse() {
    this.serverSavedNewPosition = false;
    console.log('this.serverSavedNewPosition = false;');
  }

  heroLoop() {
    //console.log('map: ' + Date.now());
    // if animation of the current step complete
    if (this.player.coord_x * this.scaledSize === this.player.pixel_x
      && this.player.coord_y * this.scaledSize === this.player.pixel_y) {
      if (this.serverSavedNewPosition === true) {
        if (this.player.hero_path != null) {
          this.lastFrameRenderTime = Date.now() - this.lastFrameTime;
          this.lastFrameTime = Date.now();
          console.log('Last frame render time: ' + this.lastFrameRenderTime);

          this.tryHeroNextStep();
        }
        else {
          // or make hero stand still
          this.player.stop();

        }
      }
      else {
        console.log('Hero stuck due to serverSavedNewPosition === false');
        // TODO: after 5s (?) of API not responding, player.revertHeroLastStep()
        // keep in mind, hero might simply not be moving (no lag)... do not revert then
      }
    }
    else {
      this.player.animate();
    }
  }

  tryHeroNextStep() {

    // proceed with next step
    this.setServerSavedNewPositionToFalse();
    this.player.moveHeroStep();
    this.player.animate();
    this.updateHeroPosition();
  }

  // TODO: remove this method / replace with gameUI call directly
  heroInfoUpdate(heroInfo) {
    this.gameUIService.heroInfoInitialize(heroInfo);
  }

  updateHeroPosition() {
    // send info about player's new coords to the server
    this.playerSavedPosition = this.player.position;
    this.mapService.updateActualPosition(this.playerSavedPosition).subscribe(data => {
      this.setServerSavedNewPosition();
      if (data.success === true) {
        this.processMapResponse(data);
      }
      else {
        this.gameUIService.showError(data.errorMessage);
        console.log('HERE');
        this.player.revertHeroLastStep();
        this.player.stop();
      }

      this.heroInfoUpdate(data.playerData);
    });
  }

  processMapResponse(data) {
    if (data.foundMonster !== null && data.foundMonster.alive === true) {
      console.log('Monster is alive!!!');
      this.player.revertHeroLastStep();
    } else {
      this.player.incrementHeroStep();
    }

    //this.handleFoundLocation(data.foundLocation, data.foundMonster);
    this.foundLocation.emit(data.foundLocation);
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
        this.player.clearMovementParams();
        this.player.stop();
      }
    }
  }


  handleFoundQuest(foundQuest: boolean) {
    this.gameUIService.showQuestIcon(foundQuest);
    // console.log('found Quest is: ');
    // console.log(foundQuest);
  }


  closeModal() {
    this.gameUIService.openedModal.emit(null);
  }
}
