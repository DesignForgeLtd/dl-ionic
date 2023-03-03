import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from 'src/app/game/game-ui.service';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss'],
})
export class FightComponent implements OnInit {

  @Input() data;

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
