import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss'],
})
export class QuestsComponent implements OnInit {

  message = null;

  constructor(
    private gameUIService: GameUIService
  ) { }

  ngOnInit() {}

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
