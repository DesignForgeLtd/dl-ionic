import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnInit {

  public isLoading = true;
  public badges: {
    name: string;
    description: string;
    level: number;
    image: number;
    received: boolean;
    points: number;
    threshold: number;
  }[];//dopisac szczegolowy interface

  public error = false;
  public message = null;

  public heroAttributes = ['strength', 'dexterity', 'vitality', 'intelligence', 'endurance', 'quickness'];

  constructor(
    private heroService: HeroService
    ) { }

  ngOnInit() {
    this.heroService.loadBadges(2).subscribe(data => {
      console.log(data);
      this.badges = data.badges;
      this.isLoading = false;
      this.error = ! data.success;
      this.message = data.errorMessage;
    });
  }


}
