/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

import { 
  PlayerData, 
  FoundLocationData,
  FoundMonsterData,
  MapResponseData,
  HeroFullData
} from 'src/app/game/shared/map-service.interfaces';

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(private http: HttpClient){}

  loadHeroEssentialData(){
    // eslint-disable-next-line max-len
    return this.http.get<{
      'playerData': PlayerData;
      'foundLocation': FoundLocationData;
      'locationFullData': any;
      'foundMonster': FoundMonsterData;
      'foundQuest': boolean;
    }>( // 'id': string;'position': number;'level': number
      AppSettings.API_ENDPOINT + '/hero/getEssentialData',
      {responseType: 'json'}
    );
  }

  loadMonstersData(){
    return this.http.get<{'success': boolean; 'monsters': string}>(
      AppSettings.API_ENDPOINT + '/map/getMonstersInfo',
      {responseType: 'json'}
    );
  }

  updateActualPosition(playerPosition){
    return this.http.post<MapResponseData>(
      AppSettings.API_ENDPOINT + '/map/move/' + playerPosition,
      {}
    );
  }

  useUndergroundPassage(direction){
    return this.http.post<MapResponseData>(
      AppSettings.API_ENDPOINT + '/map/subway/'+direction,
      {responseType: 'json'}
    );
  }

  usePortConnection(connectionId){
    return this.http.post<MapResponseData>(
      AppSettings.API_ENDPOINT + '/map/port/'+connectionId,
      {responseType: 'json'}
    );
  }

  usePortal(portalId){
    return this.http.post<MapResponseData>(
      AppSettings.API_ENDPOINT + '/map/portal/'+portalId,
      {responseType: 'json'}
    );
  }

  startMining(position){
    return this.http.post<MapResponseData>(
      AppSettings.API_ENDPOINT + '/mine/start-mining/'+position,
      {responseType: 'json'}
    );
  }

  loadHeroFullData(){
    return this.http.get<{'heroFullData': HeroFullData}>(
      AppSettings.API_ENDPOINT + '/hero/getFullData',
      {responseType: 'json'}
    );
  }

  getLocationFullData(type: number, playerPosition: number){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'locationFullData': any}>(
      AppSettings.API_ENDPOINT + '/map/locationFullData/' + type + '/' + playerPosition,
      {responseType: 'json'}
    );
  }

}
