import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss'],
})
export class FindComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

}
