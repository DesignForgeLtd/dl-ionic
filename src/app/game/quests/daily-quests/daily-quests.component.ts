import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-daily-quests',
  templateUrl: './daily-quests.component.html',
  styleUrls: ['./daily-quests.component.scss'],
})
export class DailyQuestsComponent implements OnInit {

  @Input() questsList: any[];
  @Output() suspendingQuest = new EventEmitter<{questID: number; suspend: boolean; type: string}>();

  constructor() { }

  ngOnInit() {}

  suspendQuest(questID: number, suspend: boolean){
    const type = 'daily';
    this.suspendingQuest.emit({questID, suspend, type});
  }

}
