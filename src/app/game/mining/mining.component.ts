import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GameUIService } from '../game-ui.service';

import { MapComponent } from '../map/map.component';

import { MiningService } from './mining.service';
import { MapService } from '../map/map.service';


@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss'],
})
export class MiningComponent extends MapComponent implements OnInit {

  columns   = 50;// columns and rows in map below
  rows      = 10;
  portalData = null;

  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public miningService: MiningService,
    public gameUIService: GameUIService
  ) {
    super(http, mapService, gameUIService);
  }

  loadGameMap(level: number, originalPosition: number){
    this.miningService.loadMineMap(originalPosition)
      .subscribe(data => {
        this.world.populateMap(data);
      });
  }

  updateHeroPosition(){
    // send info about player's new coords to the server

    this.playerSavedPosition = this.player.position;
    this.miningService.updatePositionInMine(this.playerSavedPosition).subscribe(data => {
      this.setServerSavedNewPosition();
      if (data.success === true){
        this.player.incrementHeroStep();
        this.gameUIService.openedModal.emit('');
        if (data.foundResource !== false){
          switch (data.foundResource)
          {
            case 'wood':
              this.showSuccess('Collected resource: ' + data.foundResource);
              this.world.replaceTileInMap(this.player.position, 'p70');
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
        this.showError(data.errorMessage);
        console.log('HERE');
        this.player.revertHeroLastStep();
        this.player.stop();
      }

      this.heroInfoUpdate(data.playerData);
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
    this.goToNextLevel(1);
  }

  goToNextLevel(mm = 0){
    console.log('going to next level...' + (mm ? 'early' : ''));

    this.miningService.goToNextLevel(this.playerSavedPosition, mm).subscribe(data => {
      if (data.success === true){
        console.log('went through portal!');
        console.log(data);
        this.player.position = data.heroPositionInMine;
        this.player.updateCoordsAndPixels(
          this.player.position % this.columns,
          Math.floor(this.player.position / this.columns)
        );

        this.world.populateMap(data.mineMap);

        this.gameUIService.openedModal.emit('');
      }
      else {
        this.showError(data.errorMessage);
      }

      //this.heroInfoUpdate(data.playerData);
    });
  }

}
