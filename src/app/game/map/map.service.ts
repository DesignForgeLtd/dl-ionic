import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(private http: HttpClient){}

  loadPlayerData(){
    return this.http.get<{'id': string;'position': number}>(
      AppSettings.API_ENDPOINT + '/player/getEssentialData',
      {responseType: 'json'}
    );
  }

  loadMonstersData(){
    return this.http.get<{'success': boolean; 'monsters': string}>(
      AppSettings.API_ENDPOINT + '/map/getMonsterInfo',
      {responseType: 'json'}
    );
  }

  updateActualPosition(playerPosition){
    return this.http.post<{'success': boolean; 'errorMessage': string; 'playerData': string; 'foundLocation': string}>(
      AppSettings.API_ENDPOINT + '/player/move/' + playerPosition,
      {}
    );
  }

}
