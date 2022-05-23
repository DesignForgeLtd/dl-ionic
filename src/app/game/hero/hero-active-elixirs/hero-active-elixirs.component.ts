import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-active-elixirs',
  templateUrl: './hero-active-elixirs.component.html',
  styleUrls: ['./hero-active-elixirs.component.scss'],
})
export class HeroActiveElixirsComponent implements OnInit {

  public isLoading = true;
  public activeElixirs: any[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.loadHeroActiveElixirs();
  }

  loadHeroActiveElixirs(){
    this.heroService.loadHeroActiveElixirs().subscribe(data => {
      this.activeElixirs = data.data;
      this.isLoading = false;
      console.log(this.activeElixirs);
    });
  }

}
