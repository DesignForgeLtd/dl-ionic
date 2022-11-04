import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { GameUIService } from '../game-ui.service';
import { MapService } from '../map/map.service';
import { MiningService } from '../mining/mining.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() occupiedWith: string;

  public items = [
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'},
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'}
  ];

  //public menuMailImg = 'assets/graphics/layout/game/plachta_buttony.jpg';

  loggedIn = false;
  atLocation = false;

  constructor(
    private authService: AuthService,
    private gameUIService: GameUIService,
    private mapService: MapService,
    private miningService: MiningService) {
      console.log('A');
      console.log(this.occupiedWith);
      this.gameUIService.currentLocationEmitter.subscribe(
        (currentLocation: string) => this.atLocation = currentLocation !== ''
      );
      this.gameUIService.playerOccupiedWith.subscribe(
        (occupation: string) => this.occupiedWith = occupation
      );
    }

  ngOnInit() {
    console.log('B');
    console.log(this.occupiedWith);
    if (this.authService.user !== null){
      this.loggedIn = true;
    }

    this.atLocation = this.gameUIService.currentLocation !== '';
    console.log('C');
    console.log(this.atLocation);
  }

  onOpenMenu(feature: string) {
    console.log('opening: '+feature);
    this.gameUIService.openedModal.emit(feature);
  }

  onLogout(){
    this.authService.logout();
  }

  showLocation(){
    this.gameUIService.openLocationModal('current-location');
  }

  stopMining(){
    this.miningService.stopMining().subscribe(data => {
      if (data.success === true){
        console.log('here!');
        console.log(data);
        //this.heroInfoUpdate(data.playerData);
        this.gameUIService.changeHeroOccupation('');
      }
      else {
        //this.showError(data.errorMessage);
        console.log(data.errorMessage);
      }
    });
  }

}
