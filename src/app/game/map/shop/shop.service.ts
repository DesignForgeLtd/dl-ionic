import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';


@Injectable({providedIn: 'root'})
export class ShopService {

  baggageUpdated = new EventEmitter<boolean>();

  constructor(private http: HttpClient){}

  loadShopData(position: number){
    //return this.http.get<{'result': Array<string>}>(
    return this.http.get<{'items': {'result': Array<string>}; 'types': Array<string>}>(
      AppSettings.API_ENDPOINT + '/shop/info/' + position,
      { responseType: 'json' }
    );
  }

  buyItem(itemId: number, quantity: number){
    return this.http.post<{'success': boolean; 'errorMessage': string}>(
      AppSettings.API_ENDPOINT + '/baggage/buy',
      {
        item_id: itemId,
        quantity
      }
    );
  }

}
