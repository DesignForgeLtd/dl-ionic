/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface BaggageData{
  'items': {
    'result': Array<string>;
  };
  'types': Array<string>;
}

interface BaggageActionResponseData{
  'success': boolean;
  'errorMessage': string;
  'hero_item': any;
  'hero_data_to_update': any;
  'quantity': number;
}

@Injectable({providedIn: 'root'})
export class BaggageService {

  baggageUpdated = new EventEmitter<boolean>();

  constructor(private http: HttpClient){}

  loadBaggageData(){
    return this.http.get<BaggageData>(
      AppSettings.API_ENDPOINT + '/baggage/info',
      {responseType: 'json'}
    );
  }

  use(baggageItemId: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/use',
      {
        baggage_item_id: baggageItemId
      }
    );
  }

  throwAway(baggageItemId: number, quantity: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/drop',
      {
        baggage_item_id: baggageItemId,
        quantity
      }
    );
  }

  equipHero(baggageItemId: number, state: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/equipHero',
      {
        baggage_item_id: baggageItemId,
        state
      }
    );
  }

}
