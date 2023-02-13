import { Component, Input, OnInit } from '@angular/core';
import { BaggageComponent } from '../baggage.component';
import { BaggageService } from '../baggage.service';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: '../baggage.component.html',
  styleUrls: ['../baggage.component.scss'],
})
export class WarehouseComponent extends BaggageComponent implements OnInit {

  @Input() passedLocationData = null;

  private locationData = null;

  constructor(
    protected gameUIService: GameUIService,
    protected baggageService: BaggageService
  ) {
    super(gameUIService, baggageService);
  }

  ngOnInit() {
    this.location = 'warehouse';
    this.locationData = this.passedLocationData;
    this.tabTitle = this.locationData.name;
    this.initialize(this.location);
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  loadSource(source: string){
    this.source = source;

    switch (source) {
      case 'baggage':
        this.getBaggageData();
        break;
      case 'storage':
        this.getStorageData();
        break;
    }
  }

  getBaggageData(){
    this.isLoading = true;
    this.expand = false;
    this.baggageService.loadBaggageData(this.location)
      .subscribe(data => {
        this.baggageItems = data.result;
        console.log('loaded baggage items from ' + this.source + ':');
        console.log(this.baggageItems);
        this.isLoading = false;

      });
  }

  getStorageData(){
    this.isLoading = true;
    this.expand = false;
    this.baggageService.loadStorageData()
      .subscribe(data => {
        this.baggageItems = data.result;
        console.log('loaded baggage items from ' + this.source + ':');
        console.log(this.baggageItems);
        this.isLoading = false;

      });
  }

}
