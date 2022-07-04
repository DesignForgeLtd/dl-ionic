import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaggagePopoverComponent } from '../baggage-popover/baggage-popover.component';

@Component({
  selector: 'app-baggage-item',
  templateUrl: './baggage-item.component.html',
  styleUrls: ['./baggage-item.component.scss'],
})
export class BaggageItemComponent implements OnInit {

  @Input() item = null;
  @Input() area = null;

  constructor(public baggageItemController: PopoverController) { }

  ngOnInit() {
    this.item = this.item.value;
    console.log(this.item);
  }

  async baggageItemClick(event){
    console.log(event);
    const popover = await this.baggageItemController.create({
      component: BaggagePopoverComponent,
      componentProps: {
        item: this.item,
        area: this.area
      },
      event
    });
    return await popover.present();
  }
}
