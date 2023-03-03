import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-marketplace-navigation',
  templateUrl: './marketplace-navigation.component.html',
  styleUrls: ['./marketplace-navigation.component.scss'],
})
export class MarketplaceNavigationComponent implements OnInit {

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
