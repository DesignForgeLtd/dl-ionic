import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-equipment',
  templateUrl: './hero-equipment.component.html',
  styleUrls: ['./hero-equipment.component.scss'],
})
export class HeroEquipmentComponent implements OnInit {

  public isLoading = true;
  public data: any;
  public error = false;
  public message = null;

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.heroService.loadEquipment()
    .subscribe(data => {
      this.data = data.data;
      this.isLoading = false;
      this.error = ! data.success;
      this.message = data.errorMessage;
      console.log('data hero eq');
      console.log(data);
    });
  }

  unEquipAll() {
    this.isLoading = true;
    this.heroService.unEquipHeroAll().subscribe(data => {
      this.isLoading = false;
      this.error = ! data.success;
      this.message = data.errorMessage;
      if( data.success ) {
        this.data = null;
        this.message = 'Hero unEquipped';
      }
    });
  }

}
