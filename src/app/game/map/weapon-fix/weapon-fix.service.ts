import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class WeaponFixService {

  constructor(private http: HttpClient) { }

  loadData(){
    return this.http.get<{
      'success': boolean;
      'message': string;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'resources': {
        'steel': number;
        'lubricant': number;
        'gold': number;
      };
      'resourcesNeeded': {
        'steel': number;
        'lubricant': number;
        'gold': number;
        'durabilityMin': number;
        'durabilityMax': number;
      };
      'available': boolean;
      'weaponList': [];
    }>(
      AppSettings.API_ENDPOINT + '/weapon/fixList',
      { responseType: 'json' }
    );
  }

  fixWeapon(weaponId: number){
    return this.http.post<{
      'success': boolean;
      'message': string;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'weapon': any;
      'resources': {
        'steel': number;
        'lubricant': number;
        'gold': number;
      };
      'available': boolean;
      'receivedBadge': any;
    }>(
      AppSettings.API_ENDPOINT + '/weapon/fix',
      { weaponId }
    );
  }

}
