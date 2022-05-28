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

  heroInfoInitialize(heroInfo){
    document.getElementById('hero-info').innerHTML =
      '<b>' + heroInfo.name + '</b> (ID: ' + heroInfo.id + ')'
      + ', Energy: ' + heroInfo.energy
      + ', Stamina: <span id="hero-stamina">' + heroInfo.stamina + '</span>'
      + ', Health: <span id="hero-health">' + heroInfo.health + '</span>'
      + ', Position: ' + heroInfo.position
      + ' (' + (heroInfo.position % 200) + ',' + Math.floor(heroInfo.position / 200) + ')'
      + ', Level: ' + heroInfo.level;
  }

  heroInfoUpdate(heroData){
    if (typeof heroData.stamina !== 'undefined'){
      document.getElementById('hero-stamina').innerHTML = heroData.stamina;
    }
    if (typeof heroData.health !== 'undefined'){
      document.getElementById('hero-health').innerHTML = heroData.health;
    }
  }

  heroHealthUpdate(health){
    document.getElementById('hero-health').innerHTML = health;
  }
}
