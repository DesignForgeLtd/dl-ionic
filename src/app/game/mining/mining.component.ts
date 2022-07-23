import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GameUIService } from '../game-ui.service';
import { MapService } from '../map/map.service';

import { MapComponent } from '../map/map.component';


@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss'],
})
export class MiningComponent extends MapComponent implements OnInit {

  columns   = 50;// columns and rows in map below
  rows      = 10;

  constructor(
    public http: HttpClient,
    public mapService: MapService,
    public gameUIService: GameUIService
  ) {
    super(http, mapService, gameUIService);
  }

  loadGameMap(level: number, originalPosition: number){
    this.mapService.loadMineMap(originalPosition)
      .subscribe(data => {
        this.world.populateMap(data);
      });
  }

  updateHeroPosition(){
    // send info about player's new coords to the server

    this.playerSavedPosition = this.player.position;
    this.mapService.updatePositionInMine(this.playerSavedPosition).subscribe(data => {
      this.setServerSavedNewPosition();
      if (data.success === true){
        this.player.incrementHeroStep();
        if (data.foundResource !== false){
          switch (data.foundResource)
          {
            case 'wood':
              this.showSuccess('Collected resource: ' + data.foundResource);
              this.world.replaceTileInMap(this.player.position, 'p70');
              break;
            case 'portal':
              console.log('Found portal!!!');
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

}
