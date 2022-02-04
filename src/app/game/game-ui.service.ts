import { EventEmitter, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GameUIService {

  openedModal = new EventEmitter<string>();


}
