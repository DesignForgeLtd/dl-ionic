import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface PlayerData{
  energy: number;
  health: number;
  id: number;
  level: number;
  name: string;
  position: number;
  stamina: number;
}

interface FoundLocationData{
  energy: number;
  health: number;
  id: number;
  level: number;
  name: string;
  position: string;
  stamina: number;
}

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(private http: HttpClient){}

  loadPlayerData(){
    return this.http.get<{'playerData': PlayerData; 'foundLocation': FoundLocationData}>( // 'id': string;'position': number;'level': number
      AppSettings.API_ENDPOINT + '/player/getEssentialData',
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
    return this.http.post<{'success': boolean; 'errorMessage': string; 'playerData': PlayerData; 'foundLocation': FoundLocationData}>(
      AppSettings.API_ENDPOINT + '/player/move/' + playerPosition,
      {}
    );
  }

  useUndergroundPassage(direction){
    return this.http.post<{'success': boolean; 'errorMessage': string; 'playerData': PlayerData; 'foundLocation': FoundLocationData}>(
      AppSettings.API_ENDPOINT + '/player/subway/'+direction,
      {responseType: 'json'}
    );
  }

}
