import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestConstants } from '../quest.constants';

@Component({
  selector: 'app-regular-quests',
  templateUrl: './regular-quests.component.html',
  styleUrls: ['./regular-quests.component.scss'],
})
export class RegularQuestsComponent implements OnInit {

  @Input() questsList: any[];
  @Output() suspendingQuest = new EventEmitter<{questID: number; suspend: boolean; type: string}>();

  public questConstants = QuestConstants;

  constructor() { }

  ngOnInit() {}

  suspendQuest(questID: number, suspend: boolean){
    const type = 'regular';
    this.suspendingQuest.emit({questID, suspend, type});
  }

}
