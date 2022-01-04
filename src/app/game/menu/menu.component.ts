import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public items = [{src : 'assets/graphics/layout/game/plachta_buttony.jpg'},
  {src : 'assets/graphics/layout/game/plachta_buttony.jpg'}];

  //public menuMailImg = 'assets/graphics/layout/game/plachta_buttony.jpg';

  constructor() { }

  ngOnInit() {}

}
