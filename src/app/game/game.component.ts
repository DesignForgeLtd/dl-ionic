import { Component, OnInit } from '@angular/core';
import { GameUIService } from './game-ui.service';
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

  constructor(
    private mapService: MapService,
    private gameUIService: GameUIService
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
    });
  }

}
