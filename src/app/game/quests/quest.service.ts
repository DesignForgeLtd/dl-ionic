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


}
