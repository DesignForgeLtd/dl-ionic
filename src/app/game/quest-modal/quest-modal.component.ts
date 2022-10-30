import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
  styleUrls: ['./quest-modal.component.scss'],
})
export class QuestModalComponent implements OnInit {

  public message: string;
  public questStepID: number;
  public questID: number;
  public questImage = 'undefined.png';
  public questStepImage = 'undefined.png';
  public questStep: number;
  public questSteps: number;
  public questTitle: string;
  public description: string;
  public requirements: {
    text: string;
    type: string;
    key: string | number;
    quantity: number;
  };
  public progress: number;
  public answers: Array<{
    text: string;
    nextQuestStepID: number;
    meetRequirements: boolean;
  }>;
  public requirementsMet = false;

  constructor(
    private mapService: MapService,
    private gameUIService: GameUIService
  ) { }

  ngOnInit() {
    this.mapService.loadQuestData().subscribe(data => {
      this.manageQuestData(data);
    });
  }

  questAnswer(nextQuestStepID: number){
    this.mapService.questAnswer(nextQuestStepID, this.questStepID).subscribe(data => {
      this.manageQuestData(data);
      this.gameUIService.showQuestIcon(data.questIcon);
    });
  }

  manageQuestData(data: any){
    console.log(data);

    if( data.message ){
      this.message = data.message;
      return;
    }

    if( ! data.questData ){
      this.closeQuestModal();
      return;
    }

    this.message = data.message;
    this.questStepID = data.questData.id;
    this.questID = data.questData.quest.id;
    this.questImage = data.questData.quest.image;
    this.questStepImage = data.questData.image;
    this.questStep = data.questData.step_number;
    this.questSteps = data.questData.quest.total_steps;
    this.questTitle = data.questData.quest.title;
    this.description = data.questData.description;
    this.requirements = data.questData.requirements;
    this.progress = data.questData.progress;
    this.answers = data.questData.answers;
    this.requirementsMet = this.requirements ? (this.progress >= this.requirements.quantity ? true : false) : true;
  }

  closeQuestModal(){
    this.gameUIService.openedQuestModal.emit(false);
  }

}
