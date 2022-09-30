import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
  styleUrls: ['./quest-modal.component.scss'],
})
export class QuestModalComponent implements OnInit {

  public questImage = 'undefined.png';
  public questStepImage = 'undefined.png';
  public questStep: number;
  public questSteps: number;
  public questTitle: string;
  public description: string;

  constructor(
    private mapService: MapService,
    private gameUIService: GameUIService
  ) { }

  ngOnInit() {
    //TODO:MarrQ - dodaj pobieranie zawartosci questa
    this.mapService.loadQuestData().subscribe(data => {
      this.questImage = data.questData.quest.image;
      this.questStepImage = data.questData.image;
      this.questStep = data.questData.step_number;
      this.questSteps = data.questData.quest.total_steps;
      this.questTitle = data.questData.quest.title;
      this.description = data.questData.description;
      console.log(data);
    });
  }

  closeQuestModal(){
    this.gameUIService.openedQuestModal.emit(false);
  }

}
