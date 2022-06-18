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


  overwriteHeroPosition(){
    return 1001;
  }

  loadGameMap(level: number, originalPosition: number){
    this.mapService.loadMineMap(originalPosition)
      .subscribe(data => {
        this.world.populateMap(data);
      });
  }

}
