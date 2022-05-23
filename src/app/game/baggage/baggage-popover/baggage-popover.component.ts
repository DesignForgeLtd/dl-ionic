import { Component, Input, OnInit } from '@angular/core';
import { BaggageService } from '../baggage.service';

@Component({
  selector: 'app-baggage-popover',
  templateUrl: './baggage-popover.component.html',
  styleUrls: ['./baggage-popover.component.scss'],
})
export class BaggagePopoverComponent implements OnInit {

  @Input() item;

  constructor(private baggageService: BaggageService) { }

  ngOnInit() {
    console.log(this.item);
  }

  baggageUse(){
    console.log('Using ' + this.item.name);
  }

  baggagePutOn(){
    console.log('Putting on ' + this.item.name);
  }

  baggageThrowAway(){
    console.log('Throwing away ' + this.item.name);
    this.baggageService.throwAway(this.item.hero_item_id, 1).subscribe(data => {

      console.log('data: ');
      console.log(data);
      console.log('threw away.');

    });
  }

}
