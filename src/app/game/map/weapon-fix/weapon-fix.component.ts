import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { WeaponFixService } from './weapon-fix.service';

@Component({
  selector: 'app-weapon-fix',
  templateUrl: './weapon-fix.component.html',
  styleUrls: ['./weapon-fix.component.scss'],
})
export class WeaponFixComponent implements OnInit {

  @Input() passedLocationData = null;
  @ViewChild('weaponFixItem') weaponFixItem: ElementRef;

  public locationData = null;
  public message = null;
  public weaponList = [];
  public resources = null;
  public resourcesNeeded = null;
  public isLoading = true;

  constructor(
    private gameUIService: GameUIService,
    private weaponFixService: WeaponFixService
  ) { }

  ngOnInit() {
    this.locationData = this.passedLocationData;
    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.weaponFixService.loadData()
      .subscribe(result => {
        this.isLoading = false;

        this.message = result.message;
        this.weaponList = result.weaponList;
        this.resources = result.resources;
        this.resourcesNeeded = result.resourcesNeeded;

        console.log('loadData: ');
        console.log(result);
        this.gameUIService.displayErrorMessageInConsole(result.errorMessage);

      });
  }

  fixWeapon(){
    this.weaponFixService.fixWeapon(this.weaponFixItem.nativeElement.value)
      .subscribe(result => {
        this.isLoading = false;

        this.message = result.message;
        this.resources = result.resources;

        if( result.success ){
          document.getElementById('weaponFixItem' + result.weapon.id).innerHTML =
            result.weapon.item.name + ' - ' + result.weapon.durability + ' / ' + result.weapon.durability_max;
          this.gameUIService.heroInfoUpdate(result.resources);
          this.gameUIService.openedBadgePopup.emit(result.receivedBadge);
        }

        console.log('loadData: ');
        console.log(result);
        this.gameUIService.displayErrorMessageInConsole(result.errorMessage);

      });
  }

}
