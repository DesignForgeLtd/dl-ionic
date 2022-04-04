import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

// interface ProductionLocationData{

// }

@Injectable({providedIn: 'root'})
export class ProductionService {

  productionLinesUpdated = new EventEmitter<boolean>();

  constructor(private http: HttpClient){}

  loadProductionLocationData(position: number){
    return this.http.get<{'productionLocationData': any}>(
      AppSettings.API_ENDPOINT + '/production/get-location-info/' + position,
      {responseType: 'json'}
    );
  }

  startProduction(itemId: number, quantity: number){
    return this.http.post<{'success': boolean; 'errorMessage': string;}>(
      AppSettings.API_ENDPOINT + '/production/start-production',
      {
        item_id: itemId,
        quantity
      }
    );
  }

  collectProducedItem(producedItemId: number){
    return this.http.post<{'success': boolean; 'errorMessage': string;}>(
      AppSettings.API_ENDPOINT + '/production/collect-produced',
      {
        produced_item_id: producedItemId
      }
    );
  }

}
