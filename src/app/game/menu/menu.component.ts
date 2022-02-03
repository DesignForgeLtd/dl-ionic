import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() openMenu = new EventEmitter<string>();

  public items = [
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'},
    {src : 'assets/graphics/layout/game/plachta_buttony.jpg'}
  ];

  //public menuMailImg = 'assets/graphics/layout/game/plachta_buttony.jpg';

  loggedIn = false;

  constructor(
    private authService: AuthService,
    private gameUIService: GameUIService) { }

  ngOnInit() {
    if (this.authService.user !== null){
      this.loggedIn = true;
    }
  }

  onOpenMenu(feature: string) {
    console.log('opening: '+feature);
    this.gameUIService.openedModal.emit(feature);
  }

  onLogout(){
    this.authService.logout();
  }

  showLocation(){
    this.gameUIService.openedModal.emit('map-location');
  }

}
