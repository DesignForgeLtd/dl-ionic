import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { BaggageService } from './baggage.service';

@Component({
  selector: 'app-baggage',
  templateUrl: './baggage.component.html',
  styleUrls: ['./baggage.component.scss'],
})
export class BaggageComponent implements OnInit {

  public isLoading = true;
  public baggageData = null;

  constructor(
    private gameUIService: GameUIService,
    private baggageService: BaggageService) { }

  ngOnInit() {
    this.initialize();
  }

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.baggageService.loadBaggageData()
      .subscribe(data => {
        this.isLoading = false;
        this.baggageData = data;

        console.log('loadBaggageData: ');
        console.log(data);

      });
  }

}
