import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import {Subject} from 'rxjs';

import { Player } from './map-scripts/player';
import { World } from './map-scripts/world';
import { WorldService } from './map-scripts/world.service';
import { MapService } from './map.service';
import { GameUIService } from '../game-ui.service';

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

  playerSubject: Subject<Player> = new Subject();

 //TODO: see which properties can be deleted
  scaledSize = 76;
  spriteSize = 76;

  playerSize = 32;
  playerScaledSize = 32;

  columns   = 200;// columns and rows in map below
  rows      = 200;


  player: Player;

  // TODO: remove after MiningComponent fixed
  world: World;
  worldService: WorldService;

  openedModal = null;
  locationData = null;
  locationFullData = null;
  monsterData = null;

  strollEvent = [];
  strollEventFind = [];
  strollEventFight = null;

  // // TODO: remove 
  heroImage: HTMLImageElement;




  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService    
  ) {
    this.heroImage = new Image();
    //this.gameUIService = new GameUIService();

    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
  }

  ngOnInit(): void {
    console.log('Map component initialized');

    this.loadHeroEssentialData();
  }


  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      console.log('Loaded: ');
      console.log(data);

      const playerData = data.playerData;
console.log(playerData);
      
      //this.worldService = new WorldService(playerData.level, this.columns, this.rows);
      this.world = new World(playerData.level, this.columns, this.rows);

      const originalPosition = playerData.position;
      if (playerData.occupied_with === 'mining'){
        playerData.position = playerData.positionInMine;
      }
console.log('this.rows: '+this.rows);
console.log('this.columns: '+this.columns);
// TODO: uncomment
      this.player = new Player(
        playerData.position % this.columns,
        Math.floor(playerData.position / this.columns),
        playerData.level,
        playerData.race_id,
        this.world,
        this.scaledSize
      );
      

      this.playerSubject.next(this.player);

      this.heroInfoUpdate(playerData);

      // this.loop();
      //this.animationFrame = window.requestAnimationFrame(() => this.loop());

      this.handleFoundLocation(data.foundLocation, data.foundMonster);
      this.handleFoundQuest(data.foundQuest);
    });
  }
  
  heroInfoUpdate(heroInfo){
    this.gameUIService.heroInfoInitialize(heroInfo);
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
        case 1:
          console.log('found Marketplace Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('marketplace');
          break;
        case 2:
          console.log('found Shop Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('shop');
          break;
        case 3:
          console.log('found Production Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('map-production-location');
          break;
        case 4:
          console.log('found Mining Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('map-location');
          break;
        case 6:
          console.log('found Monster');
          this.monsterData = foundMonster;
          this.gameUIService.openMonsterModal();
          break;
        case 8:
          console.log('found Other Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.handleOtherLocation(foundLocation.id);
          break;
        case 12:
          console.log('found Warehouse Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('warehouse');
          break;
        case 14:
          console.log('found Bank: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('bank');
          break;
        default:
          console.log('found Other Location: ');
          console.log(foundLocation);
          this.locationData = foundLocation;
          this.gameUIService.showLocationIcon('map-location');
      }
    }else{
      this.locationData = null;
      this.gameUIService.showLocationIcon('');
    }
  }

  handleOtherLocation(locationId: number){
    switch (locationId) {
      case 79:
        this.gameUIService.showLocationIcon('witch');
        break;
      case 81:
        this.gameUIService.showLocationIcon('weapon-fix');
        break;
      default:
        this.gameUIService.showLocationIcon('map-location');
    }
  }

  handleFoundQuest(foundQuest: boolean){
    this.gameUIService.showQuestIcon(foundQuest);
    console.log('found Quest is: ');
    console.log(foundQuest);
  }


  // loop() {// The game loop

  //   this.animationFrame = window.requestAnimationFrame(() => this.loop());
  //   const currentFrameTime = Date.now();

  //   // TODO: uncomment 
  //   this.heroLoop();
  //   // console.log('this.player.pixel_x, this.player.pixel_y: ' + this.player.pixel_x, this.player.pixel_y);
   
  //   // TODO: uncomment
  //   this.infolocationUpdate();
  // }


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
        // TODO: uncomment / call from MapGfx
        //this.loadGameMap(data.playerData.level);

        this.handleFoundLocation(data.foundLocation);
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }

    });
  }

  usePortal(portalId: number){
    this.mapService.usePortal(portalId).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.loadHeroEssentialData();
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }

    });
  }

  usePort(portConnection: number){
    this.mapService.usePortConnection(portConnection).subscribe(data => {
      if (data.success === true){
        console.log(data);
        this.heroInfoUpdate(data.playerData);
        // TODO: uncomment / call from MapGfx
        //this.loadGameMap(data.playerData.level); // TODO: check if can be removed
        this.gameUIService.changeHeroOccupation('journey');
      }
      else {
        this.gameUIService.showError(data.errorMessage);
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
        this.gameUIService.showError(data.errorMessage);
      }
    });
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }
}
