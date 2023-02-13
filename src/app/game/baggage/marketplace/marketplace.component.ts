import { Component, Input, OnInit } from '@angular/core';
import { BaggageComponent } from '../baggage.component';
import { BaggageService } from '../baggage.service';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: '../baggage.component.html',
  styleUrls: ['../baggage.component.scss'],
})
export class MarketplaceComponent extends BaggageComponent implements OnInit {

  @Input() passedLocationData = null;

  private locationData = null;

  constructor(
    protected gameUIService: GameUIService,
    protected baggageService: BaggageService
  ) {
    super(gameUIService, baggageService);
  }

  ngOnInit() {
    this.location = 'marketplace';
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
      case 'mySale':
        this.getMySaleData();
        break;
      case 'market':
        this.getMarketData();
        break;
    }
  }

  loadCategory(){
    if( this.source !== 'market' ){
      return;
    }

    this.getMarketData();
  }

  loadListOfItems(itemId: number){
    this.getMarketData(itemId);
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

  getMySaleData(){
    this.isLoading = true;
    this.expand = false;
    this.baggageService.loadMySaleData()
      .subscribe(data => {
        this.baggageItems = data.result;
        console.log('loaded baggage items from ' + this.source + ':');
        console.log(this.baggageItems);
        this.isLoading = false;

      });
  }

  getMarketData(itemId?: number){
    if( this.categoryId === null ){
      return;
    }

    this.expand = false;

    if ( ! itemId ) {
      itemId = 0;
      this.expand = true;
    }

    this.isLoading = true;

    this.baggageService.loadMarketData(this.typeId === 'all' ? this.categoryId : this.typeId, itemId)
      .subscribe(data => {
        this.baggageItems = data.result;
        console.log('loaded baggage items from ' + this.source + ':');
        console.log('category id: ' + this.categoryId);
        console.log(this.baggageItems);
        this.isLoading = false;

      });
  }

}
