import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }

  loadBankData(){
    return this.http.get<{
      'success': boolean;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'gold': number;
      'bank': number;
    }>(
      AppSettings.API_ENDPOINT + '/bank/info',
      { responseType: 'json' }
    );
  }

  insertGoldToBank(amount: string | number){
    return this.http.post<{
      'success': boolean;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'gold': number;
      'bank': number;
    }>(
      AppSettings.API_ENDPOINT + '/bank/insert',
      {
        amount,
      }
    );
  }

  removeGoldFromBank(amount: string | number){
    return this.http.post<{
      'success': boolean;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'gold': number;
      'bank': number;
    }>(
      AppSettings.API_ENDPOINT + '/bank/remove',
      {
        amount,
      }
    );
  }

}
