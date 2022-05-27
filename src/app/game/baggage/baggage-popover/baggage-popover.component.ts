import { Component, Input, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { BaggageService } from '../baggage.service';

@Component({
  selector: 'app-baggage-popover',
  templateUrl: './baggage-popover.component.html',
  styleUrls: ['./baggage-popover.component.scss'],
})
export class BaggagePopoverComponent implements OnInit {

  @Input() item;

  constructor(
    private baggageService: BaggageService,
    public baggageItemController: PopoverController,
    public toastController: ToastController,
    public alertController: AlertController) { }

  ngOnInit() {
    console.log(this.item);
  }

  baggageUse(){
    console.log('Using ' + this.item.name);
    this.baggageService.use(this.item.hero_item_id).subscribe(data => {
      console.log('data: ');
      console.log(data);

      this.presentToast('Used ' + this.item.name);
      this.baggageItemController.dismiss();
    });
  }

  baggagePutOn(){
    console.log('Putting on ' + this.item.name);
  }

  baggageThrowAway(){
    console.log('Throwing away ' + this.item.name);
    this.presentAlertConfirm();

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Throw away',
      message: 'Are you sure??',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          //id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          //id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.baggageItemController.dismiss();
            this.baggageService.throwAway(this.item.hero_item_id, 1).subscribe(data => {
              this.presentToast('Threw away ' + this.item.name);
              console.log('data: ');
              console.log(data);
              console.log('threw away.');
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
