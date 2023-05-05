/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class HeroService {

  constructor(private http: HttpClient){}

  loadHeroData(){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'heroData': any}>(
      AppSettings.API_ENDPOINT + '/hero/getFullData',
      {responseType: 'json'}
    );
  }

  allocateAttributePoint(attribute: string){
    return this.http.post<{'success': boolean; 'message': string; 'heroData': any}>(
      AppSettings.API_ENDPOINT + '/hero/allocateAttributePoint',
      {
        attribute,
        responseType: 'json'
      }
    );
  }

  loadHeroSkills(){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/skills',
      {responseType: 'json'}
    );
  }

  loadHeroOccupations(){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/occupations',
      {responseType: 'json'}
    );
  }

  loadHeroActiveElixirs(){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/elixirs',
      {responseType: 'json'}
    );
  }

  loadBadges(heroId: number){
    return this.http.get<{'success': boolean; 'errorMessage': string; 'badges': any}>(
      AppSettings.API_ENDPOINT + '/badges/display/'+heroId,
      {responseType: 'json'}
    );
  }

  loadEquipment() {
    return this.http.get<{'success': boolean; 'errorMessage': string; 'data': any}>(
      AppSettings.API_ENDPOINT + '/hero/equipment',
      {responseType: 'json'}
    );
  }

  unEquipHeroAll() {
    return this.http.post<{'success': boolean; 'errorMessage': string; 'quantity': number}>(
      AppSettings.API_ENDPOINT + '/baggage/unEquipHeroAll',{}
    );
  }

  removeFromBattleBelt(itemID: number, index: number) {
    return this.http.post<{'success': boolean; 'error_message': string; 'quantity': number}>(
      AppSettings.API_ENDPOINT + '/baggage/removeFromBattleBelt',{
        itemID,
        index
      }
    );
  }

}
