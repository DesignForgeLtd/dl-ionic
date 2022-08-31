/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class MiningService {
  constructor(private http: HttpClient){}

  startMining(position){
    return this.http.post(
      AppSettings.API_ENDPOINT + '/mine/start-mining/'+position,
      {responseType: 'json'}
    );
  }

  stopMining(){
    return this.http.post(
      AppSettings.API_ENDPOINT + '/mine/stop-mining',
      {responseType: 'json'}
    );
  }

  loadMineMap( playerPosition: number){
    return this.http.get(
      AppSettings.API_ENDPOINT + '/mine/map/' + playerPosition,
      {responseType: 'text'}
    );
  }

}
