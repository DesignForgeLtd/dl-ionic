/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

// TODO: remove duplication (copied from map.service.ts)
interface PlayerData{
  energy: number;
  health: number;
  id: number;
  level: number;
  hero_level: number;
  name: string;
  occupied_with: string;
  occupation_start: string;
  occupation_finish: string;
  position: number;
  stamina: number;
  positionInMine: number;
}

interface MineResponseData{
  'success': boolean;
  'errorMessage': string;
  'playerData': PlayerData;
  'foundResource': any;
  'portalData': any;
  'mineMap': any;
  'heroPositionInMine': any; // can I take it from playerData instead, and remove this?
}

@Injectable({providedIn: 'root'})
export class MiningService {
  constructor(private http: HttpClient){}

  stopMining(){
    return this.http.post<MineResponseData>(
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

  updatePositionInMine(playerPosition){
    return this.http.post<MineResponseData>(
      AppSettings.API_ENDPOINT + '/mine/move/' + playerPosition,
      {}
    );
  }

  goToNextLevel(){
    return this.http.post<MineResponseData>(
      AppSettings.API_ENDPOINT + '/mine/next-level',
      {}
    );
  }
}
