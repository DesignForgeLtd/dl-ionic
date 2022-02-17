import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-baggage',
  templateUrl: './baggage.component.html',
  styleUrls: ['./baggage.component.scss'],
})
export class BaggageComponent implements OnInit {

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

}
