import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-attributes',
  templateUrl: './hero-attributes.component.html',
  styleUrls: ['./hero-attributes.component.scss'],
})
export class HeroAttributesComponent implements OnInit {

  public isLoading = true;
  public heroData: any;

  public error = false;
  public message = null;

  public heroAttributes = ['strength', 'dexterity', 'vitality', 'intelligence', 'endurance', 'quickness'];

  constructor(
    private gameUIService: GameUIService,
    private heroService: HeroService
    ) { }

  ngOnInit() {
    this.heroService.loadHeroData().subscribe(data => {
      this.heroData = data.heroData;
      this.isLoading = false;

      this.error = ! data.success;
      this.message = data.errorMessage;
    });
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  allocateAttributePoint(attribute){
    this.isLoading = true;
    this.heroService.allocateAttributePoint(attribute).subscribe(data => {
      this.heroData = data.heroData;

      this.error = ! data.success;
      this.message = data.message;

      this.isLoading = false;
    });
  }

}
