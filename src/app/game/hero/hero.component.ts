import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {

  public heroTabs = [
    {label: 'attributes', name: 'Attributes'},
    {label: 'skills', name: 'Skills'},
    {label: 'occupations', name: 'Occupations'},
    {label: 'active-elixirs', name: 'Active Elixirs'},
    {label: 'badges', name: 'Badges'},
    {label: 'equipment', name: 'Equipment'},
  ];

  public chosenTab = 'attributes';

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeModal() {
    this.gameUIService.openedModal.emit(null);
  }

  openTab(heroTab: string){
    this.chosenTab = heroTab;
  }

}
