import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { QuestService } from '../quests/quest.service';

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
  public questStepNo: number;
  public questStepsCount: number;
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
  public rewards = false;

  constructor(
    private questService: QuestService,
    private gameUIService: GameUIService
  ) { }

  ngOnInit() {
    this.questService.loadQuestData().subscribe(data => {
      this.manageQuestData(data);
    });
  }

  questAnswer(nextQuestStepID: number){
    this.questService.questAnswer(nextQuestStepID, this.questStepID).subscribe(data => {
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
    this.questStepNo = data.questData.step_number;
    this.questStepsCount = data.questData.quest.total_steps;
    this.questTitle = data.questData.quest.title;
    this.description = data.questData.description;
    this.requirements = data.questData.requirements;
    this.progress = data.questData.progress;
    this.answers = data.questData.answers;
    this.requirementsMet = this.requirements ? (this.progress >= this.requirements.quantity ? true : false) : true;
    this.rewards = data.questData.rewards;
    this.gameUIService.openedBadgePopup.emit(data.receivedBadge);
  }

  closeQuestModal(){
    this.gameUIService.openedQuestModal.emit(false);
  }

}
