import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(private http: HttpClient){}


  updateActualPosition(playerPosition){
    this.http.post(
      AppSettings.API_ENDPOINT + '/player/move/' + playerPosition,
      {responseType: 'json'}
    )
    .subscribe(data => {
    });
  }
}
