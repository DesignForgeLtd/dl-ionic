import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { QuestService } from './quest.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss'],
})
export class QuestsComponent implements OnInit {

  // showButton = true;
  message = null;
  questsList = '';
  dailyQuestsData = [];
  regularQuestsData = [];
  professionQuestsData = [];
  timeToNextDailyQuests = null;
  priceForNextDailyQuests = null;

  constructor(
    private questService: QuestService,
    private gameUIService: GameUIService
  ) { }

  ngOnInit() {
    this.loadMyQuestsData();
  }

  loadMyQuestsData(){
    this.questService.loadMyQuestsData().subscribe(data => {
      this.message = data.message;
      this.dailyQuestsData = data.dailyQuestsData;
      this.regularQuestsData = data.regularQuestsData;
      this.professionQuestsData = data.professionQuestsData;
      this.timeToNextDailyQuests = data.timeToNextDailyQuests;
      this.priceForNextDailyQuests = data.priceForNextDailyQuests;
      console.log(data);
      this.questsList = 'daily';
    });
  }

  getNewDailyQuests(){
    this.questService.getNewDailyQuestsData().subscribe(data => {
      this.timeToNextDailyQuests = data.timeToNextDailyQuests;
      this.priceForNextDailyQuests = data.priceForNextDailyQuests;
      this.message = data.message;

      if(data.success){
        this.dailyQuestsData = data.dailyQuestsData;
      }
      console.log(data);
    });
  }

  suspendQuest(event: {questID: number; suspend: boolean; type: string}){
    this.questService.suspendQuest(event.questID, event.suspend).subscribe(data => {
      this.message = data.message;

      if(event.type === 'daily'){
        this.dailyQuestsData[event.questID].suspend = ! event.suspend;
      }
      if(event.type === 'regular'){
        this.regularQuestsData[event.questID].suspend = ! event.suspend;
      }
      if(event.type === 'profession'){
        this.professionQuestsData[event.questID].suspend = ! event.suspend;
      }
      console.log(data);
    });
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
