import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

// interface ProductionLocationData{

// }

@Injectable({providedIn: 'root'})
export class BaggageService {

  baggageUpdated = new EventEmitter<boolean>();

  constructor(private http: HttpClient){}

  loadBaggageData(){
    return this.http.get<{'baggageData': any}>(
      AppSettings.API_ENDPOINT + '/baggage/info',
      {responseType: 'json'}
    );
  }

  throwAway(baggageItemId: number, quantity: number){
    return this.http.post<{'success': boolean; 'errorMessage': string;}>(
      AppSettings.API_ENDPOINT + '/baggage/drop',
      {
        baggage_item_id: baggageItemId,
        quantity
      }
    );
  }

}
