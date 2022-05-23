import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-occupations',
  templateUrl: './hero-occupations.component.html',
  styleUrls: ['./hero-occupations.component.scss'],
})
export class HeroOccupationsComponent implements OnInit {

  public isLoading = true;
  public heroOccupations: any[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.loadHeroOccupations();
  }

  loadHeroOccupations(){
    this.heroService.loadHeroOccupations().subscribe(data => {
      this.heroOccupations = data.data;
      this.isLoading = false;
      console.log(this.heroOccupations);
    });
  }

}
