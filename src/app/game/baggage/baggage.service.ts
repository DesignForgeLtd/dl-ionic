/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface BaggageData{
  'items': {
    'result': Array<string>;
  };
  'types': Array<string>;
  'capacity': Capacity;
}

interface Capacity{
  'baggage': {
    'taken': number;
    'total': number;
  };
  'location': {
    'taken': number;
    'total': number;
  };
}

interface BaggageActionResponseData{
  'success': boolean;
  'errorMessage': string;
  'hero_item': any;
  'hero_data_to_update': any;
  'quantity': number;
  'price': number;
  'priceMin': number;
  'priceMax': number;
  'quick_belt': number;
}

interface QuickUseBeltResponseData{
  'success': boolean;
  'error_message': string;
  'result': string;
}

interface BaggageItemsData{
  'success': boolean;
  'error_message': string;
  'result': Array<string>;
}

@Injectable({providedIn: 'root'})
export class BaggageService {

  baggageUpdated = new EventEmitter<boolean>();

  capacity: Capacity;

  constructor(private http: HttpClient){}

  loadBaggageDataWithTypes(area?: string){
    const parameters = {origin: 'baggage', area};
    const queryParams = new HttpParams({ fromObject: parameters });

    return this.http.get<BaggageData>(
      AppSettings.API_ENDPOINT + '/baggage/info',
      {
        params: queryParams,
        responseType: 'json'
      }
    );
  }

  loadBaggageData(area?: string){
    const parameters = {origin: 'baggage', area};
    const queryParams = new HttpParams({ fromObject: parameters });

    return this.http.get<BaggageItemsData>(
      AppSettings.API_ENDPOINT + '/baggage/show',
      {
        params: queryParams,
        responseType: 'json'
      }
    );
  }

  loadMySaleData(){
    const parameters = {origin: 'mySale'};
    const queryParams = new HttpParams({ fromObject: parameters });

    return this.http.get<BaggageItemsData>(
      AppSettings.API_ENDPOINT + '/baggage/show',
      {
        params: queryParams,
        responseType: 'json'
      }
    );
  }

  loadStorageData(){
    const parameters = {origin: 'storage'};
    const queryParams = new HttpParams({ fromObject: parameters });

    return this.http.get<BaggageItemsData>(
      AppSettings.API_ENDPOINT + '/baggage/show',
      {
        params: queryParams,
        responseType: 'json'
      }
    );
  }

  loadMarketData(typeId: number, itemId: number){
    const parameters = {origin: 'marketplace', typeId, itemId};
    const queryParams = new HttpParams({ fromObject: parameters });

    return this.http.get<BaggageItemsData>(
      AppSettings.API_ENDPOINT + '/baggage/show',
      {
        params: queryParams,
        responseType: 'json'
      }
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

  shopBuy(itemId: number, quantity: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/purchase',
      {
        shop_item_id: itemId,
        quantity
      }
    );
  }

  quickUseBelt(itemId: number){
    return this.http.post<QuickUseBeltResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/quickUseBelt',
      {
        itemId
      }
    );
  }

  showQuickUseItems(){
    return this.http.get<any>(
      AppSettings.API_ENDPOINT + '/baggage/quickUseItems',
      {responseType: 'json'}
    );
  }

  putOnSale(baggageItemId: number, quantity: number, price: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/deal',
      {
        baggageItemId,
        quantity,
        price
      }
    );
  }

  putToStorage(baggageItemId: number, quantity: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/put',
      {
        baggageItemId,
        quantity
      }
    );
  }

  getBack(baggageItemId: number, quantity: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/get',
      {
        baggageItemId,
        quantity
      }
    );
  }

  buyFromMarketplace(baggageItemId: number, quantity: number){
    return this.http.post<BaggageActionResponseData>(
      AppSettings.API_ENDPOINT + '/baggage/buy',
      {
        baggageItemId,
        quantity
      }
    );
  }

}
