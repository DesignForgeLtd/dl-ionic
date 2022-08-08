import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class WitchService {

  constructor(private http: HttpClient) { }

  loadWitchLocationData(){
    return this.http.get<{
      'success': boolean;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'hooch': number;
    }>(
      AppSettings.API_ENDPOINT + '/witch/info',
      { responseType: 'json' }
    );
  }

  performWitchAction(actionId: number, data: string){
    return this.http.post<{
      'success': boolean;
      'errorMessage': string;
      'locationFullData': Array<string>;
      'hooch': number;
      'hoochGiven': boolean;
      'actionList': Array<{
        'id': number;
        'name': string;
      }>;
      'actionData': {
        'actionId': number;
        'text': string;
        'list': Array<{
          'id': number;
          'name': string;
        }>;
        'textbox': string;
        'heroData': Array<any>;
        'button': string;
      };
    }>(
      AppSettings.API_ENDPOINT + '/witch/action',
      {
        actionId,
        data
      }
    );
  }
}
