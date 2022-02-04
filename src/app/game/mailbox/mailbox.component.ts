import { Component, OnInit } from '@angular/core';
import { GameUIService } from '../game-ui.service';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {

  public mailbox = 'inbox';
  public threadId: number;
  public threadTitle: string;

  constructor(private gameUIService: GameUIService) { }

  ngOnInit() {}

  closeFeature() {
    this.gameUIService.openedModal.emit(null);
  }

  onChooseThread(event: { threadId: number; threadTitle: string }) {
    this.mailbox = 'thread';
    this.threadId = event.threadId;
    this.threadTitle = event.threadTitle;
  }

}
