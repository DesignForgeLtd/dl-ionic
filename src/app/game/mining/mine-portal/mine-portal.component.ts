import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';

interface MineActionEvent{
  name: string;
  param: any;
}

@Component({
  selector: 'app-mine-portal',
  templateUrl: './mine-portal.component.html',
  styleUrls: ['./mine-portal.component.scss'],
})
export class MinePortalComponent implements OnInit {

  @Input() data;
  @Output() mineAction = new EventEmitter<MineActionEvent>();
  openEarlyPrice = 1; // TODO: make it depend on time


  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

  nextLevel() {
    this.mineAction.emit({name: 'goToNextLevel', param: null});
  }

}
