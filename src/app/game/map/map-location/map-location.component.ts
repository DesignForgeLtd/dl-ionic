import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss'],
})
export class MapLocationComponent implements OnInit {

  @Input() locationData = null;

  @Output() closeMenu = new EventEmitter();
  @Output() mapLocationAction = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    console.log('initialised map-location; locationData: ');
    console.log(this.locationData);
  }

  closeFeature() {
    this.closeMenu.emit();
  }

  goLevelUp(){
    this.mapLocationAction.emit('goLevelUp');
  }

  goLevelDown(){
    this.mapLocationAction.emit('goLevelDown');
  }

}
