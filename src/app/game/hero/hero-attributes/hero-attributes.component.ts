import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../../game-ui.service';

@Component({
  selector: 'app-hero-attributes',
  templateUrl: './hero-attributes.component.html',
  styleUrls: ['./hero-attributes.component.scss'],
})
export class HeroAttributesComponent implements OnInit {

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {

  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
