import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {

  destinationName: string;
  arrivalTime: number;

  constructor(private mapService: MapService, private gameUIService: GameUIService) { }

  ngOnInit() {
    this.loadHeroEssentialData();
  }

  loadHeroEssentialData(){
    this.mapService.loadHeroEssentialData()
    .subscribe(data => {
      console.log('Loaded: ');
      console.log(data);

      const playerData = data.playerData;

      this.destinationName = data.foundLocation.name;

      //find time
      const finishTime = new Date(data.playerData.occupation_finish).getTime();
      const currentTime = new Date().getTime();
      this.arrivalTime = Math.round((finishTime - currentTime) / 1000);

      const myInterval = setInterval(() => {
        this.arrivalTime--;
        if(this.arrivalTime === 0){
          clearInterval(myInterval);
          this.gameUIService.changeHeroOccupation(null);
        }
      }, 1000);


    });
  }


}
