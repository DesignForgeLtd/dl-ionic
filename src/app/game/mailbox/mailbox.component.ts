import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {

  @Output() closeMenu = new EventEmitter();

  public mailbox = 'inbox';
  public threadId: number;
  public threadTitle: string;

  constructor() { }

  ngOnInit() {}

  closeFeature() {
    this.closeMenu.emit();
  }

  onChooseThread(event) {
    console.log(event);
    this.mailbox = 'thread';
    this.threadId = event.threadId;
    this.threadTitle = event.threadTitle;
  }

}
