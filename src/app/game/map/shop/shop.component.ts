import { Component, OnInit, Input } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

  @Input() passedLocationData = null;

  locationData = null;
  baggageItems = null;
  baggageTypes = null;

  public isLoading = true;

  constructor(
    private gameUIService: GameUIService,
    private shopService: ShopService) { }

  ngOnInit() {
    console.log('initialised shop; locationData: ');
    this.locationData = this.passedLocationData;
    console.log(this.passedLocationData);

    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.shopService.loadShopData(this.locationData.position)
      .subscribe(data => {
        this.isLoading = false;
        this.baggageItems = data.items.result;
        this.baggageTypes = data.types;

        console.log('loadBaggageData: ');
        console.log('loaded baggage types:');
        console.log(this.baggageTypes);
        console.log('loaded baggage items:');
        console.log(this.baggageItems);

        console.log('loadShopData: ');
        console.log(data);

      });
  }

}
