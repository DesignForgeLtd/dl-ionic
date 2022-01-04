import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {



  public loadedFeature = '';

  constructor() { }

  ngOnInit() {}

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

}
