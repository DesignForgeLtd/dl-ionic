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

  updateActualPosition(playerPosition){
    return this.http.post<{'playerData': string; 'foundLocation': string}>(
      AppSettings.API_ENDPOINT + '/player/move/' + playerPosition,
      {}
    );
  }

}
