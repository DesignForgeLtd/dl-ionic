import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss'],
})
export class MapLocationComponent implements OnInit {

  @Output() closeMenu = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log('initialised map-location');
  }

  closeFeature() {
    this.closeMenu.emit();
  }

}
