import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-map-production-location',
  templateUrl: './map-production-location.component.html',
  styleUrls: ['./map-production-location.component.scss'],
})
export class MapProductionLocationComponent implements OnInit {

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

}
