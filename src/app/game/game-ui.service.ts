import { EventEmitter, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GameUIService {

  public currentLocation: string;
  currentLocationEmitter = new EventEmitter<string>();
  openedModal = new EventEmitter<string>();
  playerOccupiedWith = new EventEmitter<string>();

  constructor() {
    this.currentLocation = '';
  }

  openLocationModal(location: string){
    if (location === 'current-location') {
      if (this.currentLocation !== ''){
        this.openedModal.emit(this.currentLocation);
        this.currentLocationEmitter.emit(this.currentLocation);
      }
    } else if (location === '') {
      this.currentLocation = '';
      this.openedModal.emit('');
      this.currentLocationEmitter.emit('');
    } else {
      this.currentLocation = location;
      this.openedModal.emit(location);
      this.currentLocationEmitter.emit(location);
    }
  }

  changeHeroOccupation(occupation: string){
      this.playerOccupiedWith.emit(occupation);
  }

}
