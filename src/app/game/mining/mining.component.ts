import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GameUIService } from '../game-ui.service';

import { MapComponent } from '../map/map.component';

import { MiningService } from './mining.service';
import { MapService } from '../map/map.service';
import { World } from '../map/map-scripts/World';
import { Player } from '../map/map-scripts/Player';
import { WS } from 'src/app/websockets/WS';


@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss'],
})
export class MiningComponent extends MapComponent implements OnInit {

  columns   = 50;// columns and rows in map below
  rows      = 10;
  portalData = null;

  // TODO: removed those two, when Mining uses MapGfx
  playerSavedPosition: number;
  serverSavedNewPosition = true;

  constructor(
    public http: HttpClient,
    public ws: WS,
    public mapService: MapService,
    public miningService: MiningService,
    public gameUIService: GameUIService,
    protected world: World,
    protected player: Player
  ) {
    super(http, ws, mapService, gameUIService, world, player);
  }

  loadGameMap(level: number, originalPosition: number){
    this.miningService.loadMineMap(originalPosition)
      .subscribe(data => {
        this.world.populateMap(data);

        this.world.columns = this.columns;
        this.world.rows = this.rows;
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

  updateHeroPosition(){
    // send info about player's new coords to the server
    this.playerSavedPosition = this.player.hero.position;
    this.miningService.updatePositionInMine(this.playerSavedPosition).subscribe(data => {
      this.setServerSavedNewPosition();
      if (data.success === true){
        this.player.hero.incrementHeroStep();
        this.gameUIService.openedModal.emit('');
        if (data.foundResource !== false){
          switch (data.foundResource)
          {
            case 'wood':
              this.gameUIService.showSuccess('Collected resource: ' + data.foundResource);
              this.world.replaceTileInMap(this.player.hero.position, 'p70');
              console.log(data);
              if( data.levelUp ) {
                if( data.levelUp.hero ) {
                  this.gameUIService.openedLevelUpHeroPopup.emit(data.levelUp.hero);
                }
                if( data.levelUp.occupation ) {
                  this.gameUIService.openedLevelUpOccupationPopup.emit(data.levelUp.occupation);
                }
              }
              break;
            case 'none':
              this.gameUIService.showError('No free space in baggage.');
              break;
            case 'portal':
              this.gameUIService.openedModal.emit('mine-portal-modal');
              this.portalData = data.portalData;
              break;
          }

        } else {

        }
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

  mineAction(action){
    switch (action.name){
      case 'goToNextLevel':
        this.goToNextLevel();
      break;
      case 'goToNextLevelEarly':
        this.goToNextLevelEarly();
      break;
    }
  }

  goToNextLevelEarly(){
    this.goToNextLevel();
  }

  goToNextLevel(){
    console.log('going to next level...');

    this.miningService.goToNextLevel().subscribe(data => {
      if (data.success === true){
        console.log('went through portal!');
        console.log(data);
        this.player.hero.position = data.heroPositionInMine;
        this.player.hero.updateCoordsAndPixels( // TODO: this is not the right place for this update
          this.player.hero.position % this.columns,
          Math.floor(this.player.hero.position / this.columns)
        );

        this.world.populateMap(data.mineMap);

        this.gameUIService.openedModal.emit('');
      }
      else {
        this.gameUIService.showError(data.errorMessage);
      }

      //this.heroInfoUpdate(data.playerData);
    });
  }

}
