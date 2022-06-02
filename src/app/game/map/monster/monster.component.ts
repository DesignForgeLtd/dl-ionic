import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { MapService } from '../map.service';

interface MapLocationActionEvent{
  name: string;
  param: any;
}

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss'],
})
export class MonsterComponent implements OnInit {


  @Input() passedMonsterData = null;

  @Output() mapLocationAction = new EventEmitter<MapLocationActionEvent>();

  monsterData = null;

  constructor(
    private gameUIService: GameUIService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    console.log('passedMonsterData: ');
    console.log(this.passedMonsterData);
    this.monsterData = this.passedMonsterData;
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

}
