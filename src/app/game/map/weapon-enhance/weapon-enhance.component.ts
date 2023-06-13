import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { WeaponEnhanceService } from '../weapon-enhance/weapon-enhance.service';

@Component({
  selector: 'app-weapon-enhance',
  templateUrl: './weapon-enhance.component.html',
  styleUrls: ['./weapon-enhance.component.scss'],
})
export class WeaponEnhanceComponent implements OnInit {

  @Input() passedLocationData = null;
  @ViewChild('jewelToInstall') jewelToInstall: ElementRef;

  public locationData = null;
  public message = null;
  public weaponList = [];
  public resources = null;
  public resourcesNeeded = null;
  public isLoading = true;

  constructor(
    private gameUIService: GameUIService,
    private weaponEnhanceService: WeaponEnhanceService
  ) { }

  ngOnInit() {
    this.locationData = this.passedLocationData;
    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.weaponEnhanceService.loadData()
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

  enhanceWeapon(weapon){
    const weaponID = weapon.id;
    const jewelID = this.jewelToInstall.nativeElement.value;
    this.weaponEnhanceService.enhanceWeapon(weaponID, jewelID)
      .subscribe(result => {
        this.isLoading = false;

        this.message = result.message;
        this.resources = result.resources;
        weapon = result.weapon;

        if( result.success ){
          this.gameUIService.heroInfoUpdate(result.resources);
          this.gameUIService.openedBadgePopup.emit(result.receivedBadge);
        }

        console.log('loadData: ');
        console.log(result);
        this.gameUIService.displayErrorMessageInConsole(result.errorMessage);

      });
  }

  nicknameWeapon(weapon){
    const weaponID = weapon.id;
    const nickname = (document.getElementById('nickname-for-' + weaponID) as HTMLInputElement).value;
    this.weaponEnhanceService.nicknameWeapon(weaponID, nickname)
      .subscribe(result => {
        this.isLoading = false;

        this.message = result.message;
        this.resources = result.resources;
        weapon = result.weapon;

        if( result.success ){
          this.gameUIService.heroInfoUpdate(result.resources);
          this.gameUIService.openedBadgePopup.emit(result.receivedBadge);
        }

        console.log('loadData: ');
        console.log(result);
        this.gameUIService.displayErrorMessageInConsole(result.errorMessage);

      });
  }

}
