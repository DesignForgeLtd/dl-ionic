import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() openMenu = new EventEmitter<string>();

  public items = [{src : 'assets/graphics/layout/game/plachta_buttony.jpg'},
  {src : 'assets/graphics/layout/game/plachta_buttony.jpg'}];

  //public menuMailImg = 'assets/graphics/layout/game/plachta_buttony.jpg';

  loggedIn = true; // change to `false` later

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.user !== null){
      this.loggedIn = true;
    }
  }

  onOpenMenu(feature: string) {
    //console.log('open mailbox pls');
    this.openMenu.emit(feature);
  }

}
