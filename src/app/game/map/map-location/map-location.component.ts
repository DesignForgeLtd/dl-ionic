import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { MapService } from '../map.service';

interface MapLocationActionEvent{
  name: string;
  param: any;
}

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss'],
})
export class MapLocationComponent implements OnInit {

  @Input() passedLocationData = null;

  @Output() mapLocationAction = new EventEmitter<MapLocationActionEvent>();

  locationData = null;
  locationFullData = null;

  constructor(private gameUIService: GameUIService, private mapService: MapService) { }

  ngOnInit() {
    this.locationData = this.passedLocationData;
    if(this.locationData.type === 7){
      this.getPortData();
    }
    if(this.locationData.type === 13){
      this.getPortalData();
    }
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  goLevelUp(){
    this.mapLocationAction.emit({name: 'goLevelUp', param: null});
  }

  goLevelDown(){
    this.mapLocationAction.emit({name: 'goLevelDown', param: null});
  }

  getPortData(){
    //znajdz param, wyciagnij dane z API, uzywajac serwisu map
    this.mapService.getLocationFullData(7, this.locationData.position).subscribe(data => {
      this.locationFullData = data.locationFullData;
    });
  }

  getPortalData(){
    //znajdz param, wyciagnij dane z API, uzywajac serwisu map
    this.mapService.getLocationFullData(13, this.locationData.position).subscribe(data => {
      this.locationFullData = data.locationFullData;
    });
  }

  usePort(connectionId: number){
    this.mapLocationAction.emit({name: 'goToTravel', param: connectionId});
  }

  usePortal(portalId: number){
    this.mapLocationAction.emit({name: 'usePortal', param: portalId});
  }

  startMining(){
    this.mapLocationAction.emit({name: 'startMining', param: this.locationData.position});
  }
}
