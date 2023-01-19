import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-received-badge',
  templateUrl: './received-badge.component.html',
  styleUrls: ['./received-badge.component.scss'],
})
export class ReceivedBadgeComponent implements OnInit {

  @Input() receivedBadge: {
    name: string;
    description: string;
    level: number;
    image: number;
    prize: number;
  };

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {
    console.log(this.receivedBadge);
  }

  closePopup(){
    this.gameUIService.openedBadgePopup.emit(null);
  }

}
