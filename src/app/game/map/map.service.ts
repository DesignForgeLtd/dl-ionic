/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

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
}

interface HeroFullData{
  energy: number;
  health: number;
  id: number;
  level: number;
  name: string;
  occupied_with: string;
  position: number;
  stamina: number;
}

interface FoundLocationData{
  coords: string;
  description: string;
  id: number;
  name: string;
  position: number;
  type: number;
}

interface FoundMonsterData{
  aktywny: string;
  opis: string;
  ostatnioZabil: string;
  alive: boolean;
}

interface MapResponseData{
  'success': boolean;
  'errorMessage': string;
  'playerData': PlayerData;
  'foundLocation': FoundLocationData;
  'foundMonster': FoundMonsterData;
  'receivedBadge': FoundMonsterData;
}

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(private http: HttpClient){}

  loadHeroEssentialData(){
    // eslint-disable-next-line max-len
    return this.http.get<{'playerData': PlayerData; 'foundLocation': FoundLocationData; 'locationFullData': any; 'foundMonster': FoundMonsterData}>( // 'id': string;'position': number;'level': number
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
