import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

import { MapComponent } from '../map/map.component';


@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss'],
})
export class MiningComponent extends MapComponent implements OnInit {

  /*  @ViewChild('canvas', { static: true })*/

  columns   = 50;// columns and rows in map below
  rows      = 10;

  overwriteHeroPosition(){
    return 1001;
  }

  loadGameMap(level: number){
    let data = '';
    for (let y=0; y<this.rows; y++){
      for (let x=0; x<this.columns; x++){
        if (y === 0 && x === 0){
          data += 'g16';
        } else if (y === this.rows - 1 && x === 0){
          data += 'g09';
        } else if (y === 0 && x === this.columns - 1){
          data += 'g19';
        } else if (y === this.rows - 1 && x === this.columns - 1){
          data += 'g13';
        } else if (y === 0){
          data += 'g23';
        } else if (y === this.rows - 1){
          data += 'g34';
        } else if (x === 0){
          data += 'g27';
        } else if (x === this.columns - 1){
          data += 'g31';
        } else {
          const rand = Math.floor(Math.random() * 100);
          if (rand > 90){
            data += 'z00';
          } else if (rand > 77){
            const rand2 = Math.floor(Math.random() * 6);
            data += 'g0' + rand2.toString();
          } else if (rand > 60){
            const rand2 = Math.floor(Math.random() * 6) + 72;
            data += 'p' + rand2.toString();
          } else {
            data += 'p70';
          }
        }
      }
    }

    this.world.populateMap(data);
  }


}
