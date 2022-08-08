import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { WitchService } from './witch.service';

@Component({
  selector: 'app-witch',
  templateUrl: './witch.component.html',
  styleUrls: ['./witch.component.scss'],
})
export class WitchComponent implements OnInit {

  @Input() passedLocationData = null;
  @ViewChild('witchActionData') witchActionData: ElementRef;

  locationData = null;
  message = null;
  hooch: number;
  hoochGiven = false;
  actionData = null;

  public isLoading = true;
  public actionList = [
    {id:1, name:'ja chce jesc'},
    {id:2, name:'jestes brzydka'}
  ];

  constructor(
    private gameUIService: GameUIService,
    private witchService: WitchService
  ) { }

  ngOnInit() {
    this.locationData = this.passedLocationData;
    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.witchService.loadWitchLocationData()
      .subscribe(data => {
        this.isLoading = false;

        this.hooch = data.hooch;
        this.message = data.errorMessage;

        console.log('loadWitchData: ');
        console.log(data);

      });
  }

  witchAction(actionId: number){
    let data = null;

    if(actionId > 10){
      actionId -= 10;
      data = this.witchActionData ? this.witchActionData.nativeElement.value : 'perform';
    }

    this.witchService.performWitchAction(actionId, data)
      .subscribe(result => {
        this.isLoading = false;
        this.hooch = result.hooch;
        this.hoochGiven = result.hoochGiven;
        this.actionList = result.actionList;
        this.actionData = result.actionData;

        this.message = result.errorMessage;

        if( actionId === 2 && result.actionData.heroData ){
          this.gameUIService.heroInfoUpdate(result.actionData.heroData);
        }

        console.log('loadWitchData: ');
        console.log(result);

      });
  }

}
