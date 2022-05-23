/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class HeroService {

  constructor(private http: HttpClient){}

  loadHeroData(){
    return this.http.get<{'success': boolean; 'errorMessage': boolean; 'heroData': any}>(
      AppSettings.API_ENDPOINT + '/hero/getFullData',
      {responseType: 'json'}
    );
  }

  allocateAttributePoint(attribute: string){
    return this.http.post<{'success': boolean; 'message': boolean; 'heroData': any}>(
      AppSettings.API_ENDPOINT + '/hero/allocateAttributePoint',
      {
        attribute,
        responseType: 'json'
      }
    );
  }

  loadHeroSkills(){
    return this.http.get<{'success': boolean; 'errorMessage': boolean; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/skills',
      {responseType: 'json'}
    );
  }

  loadHeroOccupations(){
    return this.http.get<{'success': boolean; 'errorMessage': boolean; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/occupations',
      {responseType: 'json'}
    );
  }

  loadHeroActiveElixirs(){
    return this.http.get<{'success': boolean; 'errorMessage': boolean; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/elixirs',
      {responseType: 'json'}
    );
  }

}
