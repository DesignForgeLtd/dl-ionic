import { Component, Input, OnInit } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { GameUIService } from '../../game-ui.service';
import { BaggageService } from '../baggage.service';

@Component({
  selector: 'app-baggage-popover',
  templateUrl: './baggage-popover.component.html',
  styleUrls: ['./baggage-popover.component.scss'],
})
export class BaggagePopoverComponent implements OnInit {

  @Input() item;
  @Input() area;
  @Input() location;

  inputAmount: number;

  constructor(
    private baggageService: BaggageService,
    private gameUIService: GameUIService,
    public baggageItemController: PopoverController,
    public toastController: ToastController,
    public alertController: AlertController) { }

  ngOnInit() {
    if( this.location ){
      if( this.area === 'baggage' ){
        const locationCapacity = this.baggageService.capacity.location.total - this.baggageService.capacity.location.taken;
        this.inputAmount = this.item.quantity > locationCapacity ? locationCapacity : this.item.quantity;
      }
      if( this.area === 'storage' || this.area === 'mySale' || this.area === 'market' ){
        const baggageCapacity = this.baggageService.capacity.baggage.total - this.baggageService.capacity.baggage.taken;
        this.inputAmount = this.item.quantity > baggageCapacity ? baggageCapacity : this.item.quantity;
      }
    }
    console.log(this.item);
    console.log('area: '+this.area);
    console.log('location: '+this.location);
    console.log(this.baggageService.capacity);
  }

  baggageUse(){
    console.log('Using ' + this.item.name);
    this.baggageService.use(this.item.hero_item_id).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Used ' + this.item.name);
        this.item.quantity -= data.quantity;
        this.gameUIService.heroInfoUpdate(data.hero_data_to_update);
        this.baggageService.baggageUpdated.emit(true);
      } else {
        this.presentToast('danger', 'Could not use ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  equipHero(){
    console.log('Putting on ' + this.item.name);
    this.baggageService.equipHero(this.item.hero_item_id, 1).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Equipped hero with ' + this.item.name);
        this.item.in_use = 1;
      } else {
        this.presentToast('danger', 'Could not equip hero with ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  unEquipHero(){
    console.log('Taking off on ' + this.item.name);
    this.baggageService.equipHero(this.item.hero_item_id, 0).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'UnEquipped ' + this.item.name + '');
        this.item.in_use = 0;
      } else {
        this.presentToast('danger', 'Could not unEquip ' + this.item.name + '');
      }
      this.baggageItemController.dismiss();
    });
  }

  baggageThrowAway(){
    console.log('Throwing away ' + this.item.name);
    this.presentAlertConfirm();

  }

  async presentToast(color: string, message: string) {
    const toast = await this.toastController.create({
      message,
      animated: true,
      color,
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
              if (data.success === true) {
                this.presentToast('success', 'Threw away ' + this.item.name);
                this.item.quantity -= data.quantity;
                this.baggageService.capacity.baggage.taken -= data.quantity;
                this.baggageService.baggageUpdated.emit(true);
              } else {
                this.presentToast('danger', 'Could not throw away ' + this.item.name);
              }

              console.log('data: ');
              console.log(data);



            });
          }
        }
      ]
    });

    await alert.present();
  }

  shopBuy(quantity: number){
    console.log('buying '+quantity+' of '+this.item.name+'...');
    this.baggageService.shopBuy(this.item.shop_item_id, quantity).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Bought ' + data.quantity + 'x ' + this.item.name + ' for total price of ' + data.price + ' gold.');
        //this.gameUIService.heroInfoUpdate(data.hero_data_to_update);
        const gold = parseInt(document.getElementById('hero-gold').innerHTML, 10); // TODO: update this when HeroInfoComponent is created
        console.log('gold:' + gold);
        document.getElementById('hero-gold').innerHTML = (gold - data.price).toString();
        this.baggageService.baggageUpdated.emit(true);
      } else {
        this.presentToast('danger', 'Could not buy ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  quickUseBelt(){
    console.log('Quick Use Belt ' + this.item.name);
    this.baggageService.quickUseBelt(this.item.item_id).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', data.result + ' ' + this.item.name);
        this.baggageService.baggageUpdated.emit(true);
        this.item.quick_belt = ! this.item.quick_belt;
      } else {
        this.presentToast('danger', 'Could not use ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  putOnSale(quantity: number, price: number){
    console.log('put on sale ' + quantity + ' ' + this.item.name);
    this.baggageService.putOnSale(this.item.hero_item_id, quantity, price).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Puted on sale ' + this.item.name);
        this.item.quantity -= data.quantity;
        this.baggageService.capacity.baggage.taken -= data.quantity;
        this.baggageService.capacity.location.taken += data.quantity;
        this.baggageService.baggageUpdated.emit(true);
      } else {
        this.presentToast('danger', 'Could not put on sale ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  putToStorage(quantity: number){
    console.log('put to storage ' + quantity + ' ' + this.item.name);
    this.baggageService.putToStorage(this.item.hero_item_id, quantity).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Puted to storage ' + this.item.name);
        this.item.quantity -= data.quantity;
        this.baggageService.capacity.baggage.taken -= data.quantity;
        this.baggageService.capacity.location.taken += data.quantity;
        this.baggageService.baggageUpdated.emit(true);
      } else {
        this.presentToast('danger', 'Could not put to storage ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  getBack(quantity: number){
    console.log('get back ' + quantity + ' ' + this.item.name);
    this.baggageService.getBack(this.item.hero_item_id, quantity).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Removed ' + this.item.name);
        this.item.quantity -= data.quantity;
        this.baggageService.capacity.baggage.taken += data.quantity;
        this.baggageService.capacity.location.taken -= data.quantity;
        this.baggageService.baggageUpdated.emit(true);
      } else {
        this.presentToast('danger', 'Could not remove ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

  buyFromMarketplace(quantity: number){
    console.log('buy from marketplace ' + quantity + ' ' + this.item.name);
    this.baggageService.buyFromMarketplace(this.item.hero_item_id, quantity).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Bought ' + this.item.name);
        this.item.quantity -= data.quantity;
        this.baggageService.capacity.baggage.taken += data.quantity;
        this.baggageService.baggageUpdated.emit(true);
        this.gameUIService.heroInfoUpdate(data.hero_data_to_update);
      } else {
        this.presentToast('danger', 'Could not buy ' + this.item.name);
      }
      this.baggageItemController.dismiss();
    });
  }

}
