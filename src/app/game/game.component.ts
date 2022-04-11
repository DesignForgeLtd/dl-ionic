import { Component, OnInit } from '@angular/core';
import { GameUIService } from './game-ui.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  playerDataOccupiedWith = 'journey';  // change null to 'journey' if you want to test journey

  /*
    TODO:

    1. load player data at this point (move this.loadHeroEssentialData(); from MapComponent)
    2. pass data from step 1 to MapComponent
    3. make playerDataOccupiedWith (above) dynamic - based on what is loaded via loadHeroEssentialData
    4. make sure occupied_with is passed with loadHeroEssentialData:
        - add to Redis or read from DB (for this may need to use the other function, loadFullData)

  */
  public openedModal = null;

  constructor(private gameUIService: GameUIService) {
    this.gameUIService.openedModal.subscribe(
      (modal: string) => this.openedModal = modal
    );
  }

  ngOnInit() {
    console.log(this.playerDataOccupiedWith);
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
