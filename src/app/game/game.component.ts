import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GameUIService } from './game-ui.service';
import { World } from './map/map-scripts/world';
import { MapService } from './map/map.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  public playerDataOccupiedWith = null;//'journey';  // change null to 'journey' if you want to test journey

  /*
    TODO:

    1. load player data at this point (move this.loadHeroEssentialData(); from MapComponent)
    2. pass data from step 1 to MapComponent
    3. make playerDataOccupiedWith (above) dynamic - based on what is loaded via loadHeroEssentialData
    4. make sure occupied_with is passed with loadHeroEssentialData:
        - add to Redis or read from DB (for this may need to use the other function, loadFullData)

  */
  public openedModal = null;
  public openedQuestModal = null;
  public openedBadgePopup = null;
  public openedLevelUpHeroPopup = null;
  public openedLevelUpOccupationPopup = null;
  public heroEssentialData = null;

  locationData = null;
  monsterData = null;
  

  constructor(
    public http: HttpClient,
    private mapService: MapService,
    private gameUIService: GameUIService,
    private world: World
  ) {
    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
    this.gameUIService.openedQuestModal.subscribe(
      (modal: string) => this.openedQuestModal = modal
    );
    this.gameUIService.openedBadgePopup.subscribe(
      (popup: string) => this.openedBadgePopup = popup
    );
    this.gameUIService.openedLevelUpHeroPopup.subscribe(
      (popup: JSON) => this.openedLevelUpHeroPopup = popup
    );
    this.gameUIService.openedLevelUpOccupationPopup.subscribe(
      (popup: JSON) => this.openedLevelUpOccupationPopup = popup
    );
    this.gameUIService.playerOccupiedWith.subscribe(
      (occupiedWith: string) => this.playerDataOccupiedWith = occupiedWith
    );
  }

  ngOnInit() {
    // MarrQ
    this.loadHeroEssentialData();
    console.log(this.playerDataOccupiedWith);
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  // MarrQ
  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      this.heroEssentialData = data;
      this.playerDataOccupiedWith = data.playerData.occupied_with;
      console.log(data);

      const playerData = data.playerData;
      //this.world = new World(playerData.level, 200, 200);
     
    });
  }

  handleFoundLocation(foundLocation, foundMonster = null) {
    if (foundLocation !== null) {
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
    } else {
      this.locationData = null;
      this.gameUIService.showLocationIcon('');
    }
  }

  handleOtherLocation(locationId: number) {
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

  useSubway(direction: string) {
    console.log('going level ' + direction + '!');
    this.mapService.useUndergroundPassage(direction).subscribe(data => {
      if (data.success === true) {
        console.log(data);
        this.gameUIService.heroInfoInitialize(data.playerData);
        // this.player.level = data.playerData.level; // TODO: FIX
        // this.world.setLevel(this.player.level); // TODO: FIX
        // TODO: uncomment / call from MapGfx
        this.loadGameMap(data.playerData.level);

        this.handleFoundLocation(data.foundLocation);
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }

    });
  }

  usePortal(portalId: number) {
    this.mapService.usePortal(portalId).subscribe(data => {
      if (data.success === true) {
        console.log(data);
        this.loadHeroEssentialData();
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }

    });
  }

  usePort(portConnection: number) {
    this.mapService.usePortConnection(portConnection).subscribe(data => {
      if (data.success === true) {
        console.log(data);
        this.gameUIService.heroInfoInitialize(data.playerData);
        // TODO: uncomment / call from MapGfx
        //this.loadGameMap(data.playerData.level); // TODO: check if can be removed
        this.gameUIService.changeHeroOccupation('journey');
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }
    });
  }

  startMining(position: number) {
    this.mapService.startMining(position).subscribe(data => {
      if (data.success === true) {
        console.log('MINING STARTED');
        console.log(data);
        this.gameUIService.heroInfoInitialize(data.playerData);
        this.gameUIService.changeHeroOccupation('mining');
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }
    });
  }

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
}
