import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { BaggageService } from './baggage.service';

@Component({
  selector: 'app-baggage',
  templateUrl: './baggage.component.html',
  styleUrls: ['./baggage.component.scss'],
})
export class BaggageComponent implements OnInit {

  public isLoading = true;
  public baggageData = null;
  public baggageTypes = null;
  public baggageItems = null;
  public currentParentId = null;

  constructor(
    private gameUIService: GameUIService,
    private baggageService: BaggageService) { }

  ngOnInit() {
    this.initialize();
  }

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.baggageService.loadBaggageData()
      .subscribe(data => {
        this.isLoading = false;
        this.baggageData = data;
        this.baggageItems = data.items.result;
        this.baggageTypes = data.types;

        console.log('loadBaggageData: ');
        console.log('loaded baggage types:');
        console.log(this.baggageTypes);
        console.log('loaded baggage items:');
        console.log(this.baggageItems);

      });
  }

  openCategory(id: number){
    console.log('opening category id '+id);

    this.currentParentId = id;

    const parentTypeWrappers = document.querySelectorAll('.baggage-parent-wrapper');
    parentTypeWrappers.forEach(element => {
      element.setAttribute('style', 'display: none');
    });

    document.getElementById('baggage-parent-id-'+id).style.display = 'block';
  }

  filterSubtype(id: any){
    console.log('opening subcategory id '+id);

    const parentWrapper = document.getElementById('baggage-parent-id-'+this.currentParentId);
    const childTypeWrappers = parentWrapper.querySelectorAll('.baggage-child-wrapper');
    const typeButtons = parentWrapper.querySelector('.baggage-subtypes').querySelectorAll('.button');

    for(const element of childTypeWrappers){
      if (id === 'all' || parseInt(element.getAttribute('catid'), 10) === id){
        element.setAttribute('style', 'display: inline-block');
      }
      else{
        element.setAttribute('style', 'display: none');
      }
    }

    for(const element of typeButtons){
      if (element.getAttribute('catid') == id){
        element.setAttribute('color', 'primary');
        element.setAttribute('ng-reflect-color', 'primary');
      }
      else{
        element.setAttribute('color', 'secondary');
        element.setAttribute('ng-reflect-color', 'secondary');
      }
    }
  }

}
