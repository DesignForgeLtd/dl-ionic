import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { ProductionService } from './production.service';

@Component({
  selector: 'app-map-production-location',
  templateUrl: './map-production-location.component.html',
  styleUrls: ['./map-production-location.component.scss'],
})
export class MapProductionLocationComponent implements OnInit {

  @Input() passedLocationData = null;

  @Output() mapLocationAction = new EventEmitter<string>();

  public isLoading = true;
  public locationData = null;

  constructor(
    private gameUIService: GameUIService,
    private productionService: ProductionService) {
      this.productionService.productionLinesUpdated.subscribe(
        (status: boolean) => {
          console.log('productionLinesUpdated changed to TRUE - reinitializing lines');
          this.initialize();
          //this.productionService.productionLinesUpdated.emit(false);
        }
      );
    }

  ngOnInit() {
    console.log('initialised map-location; locationData: ');
    console.log(this.passedLocationData);

    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.productionService.loadProductionLocationData(this.passedLocationData.position)
      .subscribe(data => {
        this.isLoading = false;
        this.locationData = data;

        console.log('loadProductionLocationData: ');
        console.log(data);

        console.log('this.locationData.production_lines: ');
        console.log(this.locationData.production_lines);


      });
  }

}
