import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-warehouse-navigation',
  templateUrl: './warehouse-navigation.component.html',
  styleUrls: ['./warehouse-navigation.component.scss'],
})
export class WarehouseNavigationComponent implements OnInit {

  @Output() chooseSource = new EventEmitter<string>();
  source = 'baggage';

  constructor() { }

  ngOnInit() {}

  getSource(source: string)
  {
    this.source = source;
    this.chooseSource.emit(source);
  }

}
