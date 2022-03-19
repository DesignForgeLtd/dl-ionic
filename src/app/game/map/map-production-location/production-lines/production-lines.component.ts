import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-production-lines',
  templateUrl: './production-lines.component.html',
  styleUrls: ['./production-lines.component.scss'],
})
export class ProductionLinesComponent implements OnInit {

  @Input() productionLines = null;
  @Input() available = null;

  constructor() {

  }

  ngOnInit() {
    console.log(this.productionLines);
  }

}
