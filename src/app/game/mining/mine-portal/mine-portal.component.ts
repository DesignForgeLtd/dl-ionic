import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-mine-portal',
  templateUrl: './mine-portal.component.html',
  styleUrls: ['./mine-portal.component.scss'],
})
export class MinePortalComponent implements OnInit {

  @Input() data;
  openEarlyPrice = 1; // TODO: make it depend on time

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

}
