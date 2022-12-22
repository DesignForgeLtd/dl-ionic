import { Component, OnInit } from '@angular/core';
import { BaggageService } from '../baggage/baggage.service';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-quick-use-belt',
  templateUrl: './quick-use-belt.component.html',
  styleUrls: ['./quick-use-belt.component.scss'],
})
export class QuickUseBeltComponent implements OnInit {

  public quickUseBeltItems = [];

  constructor(
    private gameUIService: GameUIService,
    private baggageService: BaggageService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.baggageService.showQuickUseItems()
      .subscribe(data => {

        console.log('quick use belt loaded: ');
        console.log(data);

        Object.keys(data.result).map(itemsGroup => {
          const group = data.result[itemsGroup];
          Object.keys(group).map(itemsIndex => {
            const item = group[itemsIndex];
            this.quickUseBeltItems.push(item);
          });
        });
      });
  }

  baggageUse(item){
    console.log('Using ' + item.name);
    this.baggageService.use(item.hero_item_id).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        // this.presentToast('success', 'Used ' + item.name);
        item.quantity -= data.quantity;
        this.gameUIService.heroInfoUpdate(data.hero_data_to_update);
      } else {
        // this.presentToast('danger', 'Could not use ' + this.item.name);
      }
      // this.baggageItemController.dismiss();
    });
  }

  log(val) { console.log(val); }

}
