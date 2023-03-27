import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-level-up-occupation',
  templateUrl: './level-up-occupation.component.html',
  styleUrls: ['./level-up-occupation.component.scss'],
})
export class LevelUpOccupationComponent implements OnInit {

  @Input() data = null;

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closePopup(){
    this.gameUIService.openedLevelUpOccupationPopup.emit(null);
  }

}
