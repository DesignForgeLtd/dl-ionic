import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-level-up-hero',
  templateUrl: './level-up-hero.component.html',
  styleUrls: ['./level-up-hero.component.scss'],
})
export class LevelUpHeroComponent implements OnInit {

  @Input() data = null;

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closePopup(){
    this.gameUIService.openedLevelUpHeroPopup.emit(null);
  }

}
