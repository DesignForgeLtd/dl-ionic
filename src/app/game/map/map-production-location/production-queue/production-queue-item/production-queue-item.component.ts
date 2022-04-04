import { Component, Input, OnInit } from '@angular/core';
import { ProductionService } from '../../production.service';

@Component({
  selector: 'app-production-queue-item',
  templateUrl: './production-queue-item.component.html',
  styleUrls: ['./production-queue-item.component.scss'],
})
export class ProductionQueueItemComponent implements OnInit {

  @Input() item = null;
  @Input() ready = null; // = production completed, can collect

  constructor(private productionService: ProductionService) { }

  ngOnInit() {
    console.log(this.item);
  }

  collectItem(){
    this.productionService.collectProducedItem(this.item.id).subscribe(data => {
      console.log(data);
      if (data.success === true) {
        this.productionService.productionLinesUpdated.emit(true);
      }
    });
  }

}
