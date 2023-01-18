import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { QuestService } from '../quest.service';
import { QuestConstants } from '../quest.constants';

@Component({
  selector: 'app-daily-quests',
  templateUrl: './daily-quests.component.html',
  styleUrls: ['./daily-quests.component.scss'],
})
export class DailyQuestsComponent implements OnInit {

  @Input() questsList: any[];
  @Input() timeToNextDailyQuests: number;
  @Input() priceForNextDailyQuests: number;
  @Output() suspendingQuest = new EventEmitter<{questID: number; suspend: boolean; type: string}>();
  @Output() getDailyQuests = new EventEmitter();

  public questConstants = QuestConstants;

  constructor(
    private questService: QuestService,
    private gameUIService: GameUIService
  ) { }

  ngOnInit() { }

  suspendQuest(questID: number, suspend: boolean){
    const type = 'daily';
    this.suspendingQuest.emit({questID, suspend, type});
  }

  getNewDailyQuests(){
    this.getDailyQuests.emit();
  }

}
