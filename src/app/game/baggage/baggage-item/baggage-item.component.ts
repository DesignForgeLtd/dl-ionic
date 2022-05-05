import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-baggage-item',
  templateUrl: './baggage-item.component.html',
  styleUrls: ['./baggage-item.component.scss'],
})
export class BaggageItemComponent implements OnInit {

  @Input() item = null;

  constructor() { }

  ngOnInit() {
    this.item = this.item.value;
  }

}
