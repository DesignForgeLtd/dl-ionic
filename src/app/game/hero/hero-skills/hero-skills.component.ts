import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-skills',
  templateUrl: './hero-skills.component.html',
  styleUrls: ['./hero-skills.component.scss'],
})
export class HeroSkillsComponent implements OnInit {

  public isLoading = true;
  public heroSkills: any[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.loadHeroSkills();
  }

  loadHeroSkills(){
    this.heroService.loadHeroSkills().subscribe(data => {
      this.heroSkills = data.data;
      this.isLoading = false;
      console.log(this.heroSkills);
    });
  }

}
