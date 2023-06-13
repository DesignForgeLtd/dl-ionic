import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class WeaponEnhanceService {

  constructor(private http: HttpClient) { }

  loadData(){
    return this.http.get<{
      'success': boolean;
      'message': string;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'resources': {
        'gold': number;
        'mm': number;
        'jewels': Array<any>;
      };
      'resourcesNeeded': {
        'gold': number;
        'mm': number;
      };
      'enhancementAvailable': boolean;
      'nicknameAvailable': boolean;
      'weaponList': [];
    }>(
      AppSettings.API_ENDPOINT + '/weapon/enhanceList',
      { responseType: 'json' }
    );
  }

  enhanceWeapon(weaponID: number, jewelID: number){
    return this.http.post<{
      'success': boolean;
      'message': string;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'weapon': any;
      'resources': {
        'gold': number;
        'mm': number;
        'jewels': Array<any>;
      };
      'enhancementAvailable': boolean;
      'nicknameAvailable': boolean;
      'receivedBadge': any;
    }>(
      AppSettings.API_ENDPOINT + '/weapon/enhance',
      { weaponID, jewelID }
    );
  }

  nicknameWeapon(weaponID: number, nickname: string){
    return this.http.post<{
      'success': boolean;
      'message': string;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'weapon': any;
      'resources': {
        'gold': number;
        'mm': number;
        'jewels': Array<any>;
      };
      'enhancementAvailable': boolean;
      'nicknameAvailable': boolean;
      'receivedBadge': any;
    }>(
      AppSettings.API_ENDPOINT + '/weapon/nickname',
      { weaponID, nickname }
    );
  }

}
