import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
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
    private baggageService: BaggageService,
    // public baggageItemController: PopoverController,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.initialize();
    this.baggageService.baggageUpdated.subscribe(data => this.initialize());
  }

  initialize(){
    this.quickUseBeltItems = [];
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
        this.presentToast('success', 'Used ' + item.name);
        item.quantity -= data.quantity;
        this.gameUIService.heroInfoUpdate(data.hero_data_to_update);
      } else {
        this.presentToast('danger', 'Could not use ' + item.name);
      }
    });
  }

  log(val) { console.log(val); }

  async presentToast(color: string, message: string) {
    const toast = await this.toastController.create({
      message,
      animated: true,
      color,
      duration: 2000
    });
    toast.present();
  }

}
