import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaggagePopoverComponent } from '../baggage-popover/baggage-popover.component';

@Component({
  selector: 'app-baggage-item',
  templateUrl: './baggage-item.component.html',
  styleUrls: ['./baggage-item.component.scss'],
})
export class BaggageItemComponent implements OnInit {

  @Input() expand = false;
  @Input() item = null;
  @Input() area = null;
  @Input() location = null;

  @Output() loadListOfItems = new EventEmitter<number>();

  itemImgSrc = 'items';

  constructor(public baggageItemController: PopoverController) { }

  ngOnInit() {
    this.item = this.item.value;
    if( this.item.weapon ) {
      this.itemImgSrc = 'uzbrojenie';
    }
    console.log(this.item);
  }

  async baggageItemClick(event){
    console.log(event);

    if( this.expand ){
      this.loadListOfItems.emit(this.item.item_id);
      return;
    }

    const popover = await this.baggageItemController.create({
      component: BaggagePopoverComponent,
      componentProps: {
        item: this.item,
        area: this.area,
        location: this.location
      },
      event
    });
    return await popover.present();
  }
}
