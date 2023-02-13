import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';
import { BaggageService } from './baggage.service';

@Component({
  selector: 'app-baggage',
  templateUrl: './baggage.component.html',
  styleUrls: ['./baggage.component.scss'],
})
export class BaggageComponent implements OnInit {

  public location = null;
  public source = 'baggage';
  public tabTitle = 'Your baggage';

  public isLoading = true;
  // public baggageData = null;
  public capacity = null;
  public baggageTypes = null;
  public baggageItems = null;
  public categoryId = null;
  public typeId: any = 'all';
  public expand = false;

  constructor(
    protected gameUIService: GameUIService,
    protected baggageService: BaggageService) { }

  ngOnInit() {
    this.initialize();
  }

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

  initialize(area?: string){
    // this.categoryId = null;
    this.baggageService.loadBaggageDataWithTypes(area)
      .subscribe(data => {
        // this.baggageData = data;
        this.baggageItems = data.items.result;
        this.baggageTypes = data.types;
        this.baggageService.capacity = data.capacity;
        this.capacity = this.baggageService.capacity;

        console.log('loadBaggageDataWithTypes: ');
        console.log('loaded baggage types:');
        console.log(this.baggageTypes);
        console.log('loaded baggage items:');
        console.log(this.baggageItems);
        console.log(data);
        this.isLoading = false;
      });
  }

  openCategory(categoryId: number){
    this.categoryId = categoryId;

    const parentTypeWrappers = document.querySelectorAll('.baggage-parent-wrapper');
    parentTypeWrappers.forEach(element => {
      element.setAttribute('style', 'display: none');
    });

    const parentWrapper = document.getElementById('baggage-parent-id-'+this.categoryId);
    parentWrapper.style.display = 'block';

    const typeButtons = parentWrapper.querySelector('.baggage-subtypes').querySelectorAll('.button');

    for(const element of typeButtons){
      if ( element.getAttribute('color') === 'primary' ){
        this.typeId = element.getAttribute('catid');
      }
    }

    const childTypeWrappers = parentWrapper.querySelectorAll('.baggage-child-wrapper');

    for(const element of childTypeWrappers){
      if (element.getAttribute('catid') === this.typeId){
        element.setAttribute('style', 'display: inline-block');
      }
    }

    console.log('opening category id '+this.categoryId);
    console.log('opening type id '+this.typeId);

    if( this.location !== null ){
      this.loadCategory();
    }
  }

  filterSubtype(typeId: any){
    this.typeId = typeId;

    const parentWrapper = document.getElementById('baggage-parent-id-'+this.categoryId);
    // const childTypeWrappers = parentWrapper.querySelectorAll('.baggage-child-wrapper');
    const typeButtons = parentWrapper.querySelector('.baggage-subtypes').querySelectorAll('.button');

    // for(const element of childTypeWrappers){
    //   if (this.typeId === 'all' || parseInt(element.getAttribute('catid'), 10) === +this.typeId){
    //     element.setAttribute('style', 'display: inline-block');
    //   }
    //   else{
    //     element.setAttribute('style', 'display: none');
    //   }
    // }

    for(const element of typeButtons){
      if (element.getAttribute('catid') === String(this.typeId)){
        element.setAttribute('color', 'primary');
        element.setAttribute('ng-reflect-color', 'primary');
      }
      else{
        element.setAttribute('color', 'secondary');
        element.setAttribute('ng-reflect-color', 'secondary');
      }
    }

    console.log('opening category id '+this.categoryId);
    console.log('opening type id '+this.typeId);

    if( this.location !== null ){
      this.loadCategory();
    }
  }

  loadSource(source: string){
    // just initialization for marketplace and warehouse components
  }

  loadCategory(){
    // just initialization for marketplace component
  }

  loadListOfItems(itemId: number){
    // just initialization for marketplace component
  }

}
