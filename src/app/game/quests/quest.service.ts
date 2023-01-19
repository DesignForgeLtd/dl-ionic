/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/AppSettings';

interface QuestResponseData {
  success: boolean;
  errorMessage: string;
  message: string;
  questData: QuestData;
  questIcon: boolean;
  receivedBadge: any;
}

interface QuestData{
  id: number;
  quest: {
    id: number;
    image: string;
    title: string;
    total_steps: number;
  };
  image: string;
  description: string;
  step_number: number;
  requirements: boolean | {
    text: string;
    type: string;
    key: string | number;
    quantity: number;
  };
  progress: number;
  answers: boolean | {
    nextQuestStepID: number;
    text: string;
    meetRequirements: boolean;
  }[];
  quest_step_type_id: number;
}

interface QuestsResponseData {
  success: boolean;
  errorMessage: string;
  message: string;
  dailyQuestsData: QuestData[];
  regularQuestsData: QuestData[];
  professionQuestsData: QuestData[];
  timeToNextDailyQuests: number;
  priceForNextDailyQuests: number;
}

interface SuspendQuestResponseData {
  success: boolean;
  errorMessage: string;
  message: string;
}

interface NewDailyQuestsResponseData {
  success: boolean;
  errorMessage: string;
  message: string;
  dailyQuestsData: QuestData[];
  timeToNextDailyQuests: number;
  priceForNextDailyQuests: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  constructor(private http: HttpClient) { }

  loadQuestData(){
    return this.http.get<QuestResponseData>(
      AppSettings.API_ENDPOINT + '/quest/getData',
      {responseType: 'json'}
    );
  }

  questAnswer(nextQuestStepID: number, prevQuestStepID: number){
    return this.http.post<QuestResponseData>(
      AppSettings.API_ENDPOINT + '/quest/makeAnswer',
      {
        nextQuestStepID,
        prevQuestStepID,
        responseType: 'json'
      }
    );
  }

  loadMyQuestsData(){
    return this.http.get<QuestsResponseData>(
      AppSettings.API_ENDPOINT + '/quest/getMyQuests',
      {responseType: 'json'}
    );
  }

  suspendQuest(questID: number, suspend: boolean){
    return this.http.post<SuspendQuestResponseData>(
      AppSettings.API_ENDPOINT + '/quest/suspendQuest',
      {
        questID,
        suspend,
        responseType: 'json'
      }
    );
  }

  getNewDailyQuestsData(){
    return this.http.get<NewDailyQuestsResponseData>(
      AppSettings.API_ENDPOINT + '/quest/getNewDailyQuests',
      {responseType: 'json'}
    );
  }


}
