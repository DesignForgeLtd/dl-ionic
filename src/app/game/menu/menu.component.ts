import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public items = [
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'},
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'}
  ];

  //public menuMailImg = 'assets/graphics/layout/game/plachta_buttony.jpg';

  loggedIn = false;
  atLocation = false;

  constructor(
    private authService: AuthService,
    private gameUIService: GameUIService) {
      this.gameUIService.currentLocationEmitter.subscribe(
        (currentLocation: string) => this.atLocation = currentLocation !== ''
      );
    }

  ngOnInit() {
    if (this.authService.user !== null){
      this.loggedIn = true;
    }

    this.atLocation = this.gameUIService.currentLocation !== '';
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

}
