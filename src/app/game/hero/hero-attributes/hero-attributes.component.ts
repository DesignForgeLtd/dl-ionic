import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-attributes',
  templateUrl: './hero-attributes.component.html',
  styleUrls: ['./hero-attributes.component.scss'],
})
export class HeroAttributesComponent implements OnInit {

  public heroData: any;

  constructor(
    private gameUIService: GameUIService,
    private heroService: HeroService
    ) { }

  ngOnInit() {
    this.heroService.loadHeroData().subscribe(data => {
      this.heroData = data.heroData;
    });
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
