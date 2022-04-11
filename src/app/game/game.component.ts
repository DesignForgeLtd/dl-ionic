import { Component, OnInit } from '@angular/core';
import { GameUIService } from './game-ui.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  playerDataOccupiedWith = 'journey';
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
