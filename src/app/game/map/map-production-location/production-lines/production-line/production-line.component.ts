import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-production-line',
  templateUrl: './production-line.component.html',
  styleUrls: ['./production-line.component.scss'],
})
export class ProductionLineComponent implements OnInit {

  @Input() productionLine = null;
  @Input() available = null;

  constructor() { }

  ngOnInit() {
    if (this.productionLine.component1_required_quantity > this.productionLine.component1_in_baggage){
      this.available = false;
    }

    if (typeof this.productionLine.component2_id != 'undefined'
    && this.productionLine.component2_required_quantity > this.productionLine.component2_in_baggage) {
      this.available = false;
    }

    if (typeof this.productionLine.component3_id != 'undefined'
    && this.productionLine.component3_required_quantity > this.productionLine.component3_in_baggage) {
      this.available = false;
    }
  }

  /*
  component1_id: 53
  component1_in_baggage: 0
  component1_name: "rekin"
  component1_required_quantity: 4
  component2_id: 119
  component2_in_baggage: 0
  component2_name: "mąka"
  component2_required_quantity: 1
  component3_id: 1
  component3_in_baggage: 0
  component3_name: "grzyby"
  component3_required_quantity: 3
  energy: 23
  gold: 8
  hero_exp: 23
  occupation_exp: 23
  produced_id: 55
  produced_in_baggage: 0
  produced_name: "steki z rekina"
  */

}
