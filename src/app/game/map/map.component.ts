import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import {Subject} from 'rxjs';

import { Player } from './map-scripts/player';
import { World } from './map-scripts/world';
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
  world: World;

  openedModal = null;
  locationData = null;
  locationFullData = null;
  monsterData = null;

  strollEventFind = [];
  strollEventInterval = null;
  strollEventFight = null;

  // // TODO: remove
  heroImage: HTMLImageElement;

  serverSavedNewPosition = true;
  playerSavedPosition: number;

  lastFrameRenderTime;
  lastFrameTime;

  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService
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
  }


  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      // console.log('Loaded: ');
      // console.log(data);

      const playerData = data.playerData;

      //console.log(playerData);
      //       console.log('HERE: this.columns: ' + this.columns);
      //  console.log('HERE: this.rows: ' + this.rows);

      this.world = new World(playerData.level, this.columns, this.rows);

      const originalPosition = playerData.position;
      if (playerData.occupied_with === 'mining'){
        playerData.position = playerData.positionInMine;
      }
      // console.log('this.rows: '+this.rows);
      // console.log('this.columns: '+this.columns);

      this.player = new Player(
        playerData.position % this.columns,
        Math.floor(playerData.position / this.columns),
        playerData.level,
        playerData.race_id,
        this.world,
        this.scaledSize
      );

      this.loadGameMap(this.player.level, this.player.position);

      this.playerSubject.next(this.player);

      this.heroInfoUpdate(playerData);

      this.handleFoundLocation(data.foundLocation, data.foundMonster);
      this.handleFoundQuest(data.foundQuest);
    });
  }

  loadGameMap(level: number, originalPosition: number = null){
    this.http.get(
      'assets/detailedMap'+(level+1)+'.txt',
      {responseType: 'text'}
    )
    .subscribe(data => {
        this.world.populateMap(data);
        console.log('MAP LOADED');
    });
  }

  heroInfoUpdate(heroInfo){
    this.gameUIService.heroInfoInitialize(heroInfo);
  }

  setServerSavedNewPosition(){
    this.serverSavedNewPosition = true;
    console.log('this.serverSavedNewPosition = true;');
  }

  setServerSavedNewPositionToFalse(){
    this.serverSavedNewPosition = false;
    console.log('this.serverSavedNewPosition = false;');
  }

  heroLoop(){
    //console.log('map: ' + Date.now());
    // if animation of the current step complete
    if (this.player.coord_x * this.scaledSize === this.player.pixel_x
      && this.player.coord_y * this.scaledSize === this.player.pixel_y)
    {
      if (this.serverSavedNewPosition === true){
        if (this.player.hero_path != null)
        {
          this.lastFrameRenderTime = Date.now() - this.lastFrameTime;
          this.lastFrameTime = Date.now();
          console.log('Last frame render time: ' + this.lastFrameRenderTime);

          this.tryHeroNextStep();
        }
        else
        {
          // or make hero stand still
          this.player.stop();
          
        }
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
    
      // proceed with next step
      this.setServerSavedNewPositionToFalse();
      this.player.moveHeroStep();
      //this.player.animate(this.lastFrameRenderTime);
      this.player.animate();
      this.updateHeroPosition();
    // }
    // else
    // {
     
    // }
  }


  updateHeroPosition(){
    // send info about player's new coords to the server
      this.playerSavedPosition = this.player.position;
      this.mapService.updateActualPosition(this.playerSavedPosition).subscribe(data => {
        this.setServerSavedNewPosition();
        if (data.success === true){
          // console.log('data.strollEvent:');
          // console.log(data.strollEvent);
          // console.log('data.foundLocation:');
          // console.log(data.foundLocation);
          // console.log('data:');
          // console.log(data);
          //this.handleFoundMonster(data.foundMonster);

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

  processMapResponse(data){
    // console.log('RECEIVED FROM MAP-GFX:');
    // console.log(data);

    if (data.foundMonster !== null && data.foundMonster.alive === true){
      console.log('Monster is alive!!!');
      this.player.revertHeroLastStep();
    } else {
      this.player.incrementHeroStep();
    }

    this.handleFoundLocation(data.foundLocation, data.foundMonster);
    this.handleFoundQuest(data.foundQuest);

    if (data.strollEvent !== null) {
      if (data.strollEvent.type === 'find') {
        if(this.strollEventInterval) {
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
    // console.log('found Quest is: ');
    // console.log(foundQuest);
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
        // TODO: uncomment / call from MapGfx
        this.loadGameMap(data.playerData.level);

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
        console.log('MINING STARTED');
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
