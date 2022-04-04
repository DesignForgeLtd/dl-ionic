import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-production-queue',
  templateUrl: './production-queue.component.html',
  styleUrls: ['./production-queue.component.scss'],
})
export class ProductionQueueComponent implements OnInit {

  @Input() items = null;
  @Input() ready = null;

  constructor() { }

  ngOnInit() {}

}
