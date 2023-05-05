import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-belt-item',
  templateUrl: './belt-item.component.html',
  styleUrls: ['./belt-item.component.scss'],
})
export class BeltItemComponent implements OnInit {

  @Input() item = null;
  @Input() index = null;

  constructor(
    private heroService: HeroService,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    console.log(this.item);
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

  removeFromBattleBelt() {
    console.log('remove item from battle belt ' + this.item.name + ' [' + this.index + ']');
    this.heroService
    .removeFromBattleBelt(this.item.id, this.index).subscribe(data => {
      console.log('data: ');
      console.log(data);
      if (data.success === true) {
        this.presentToast('success', 'Removed ' + this.item.name);
        this.item = null;
      }
      else {
        this.presentToast('danger', data.error_message);
      }
    });
  }

}
