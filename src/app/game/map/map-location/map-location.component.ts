import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss'],
})
export class MapLocationComponent implements OnInit {

  @Input() locationData = null;

  @Output() mapLocationAction = new EventEmitter<string>();

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {
    console.log('initialised map-location; locationData: ');
    console.log(this.locationData);
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  goLevelUp(){
    this.mapLocationAction.emit('goLevelUp');
  }

  goLevelDown(){
    this.mapLocationAction.emit('goLevelDown');
  }

}
